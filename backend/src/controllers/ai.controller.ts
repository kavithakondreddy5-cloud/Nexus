import { Response } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest, GenerateAIResponseDTO, TaskComplexity } from '../types/index.js';
import { geminiService } from '../services/gemini.service.js';
import { auditService } from '../services/audit.service.js';
import { env } from '../config/env.js';

// Request Validation Schema
const generateSchema = z.object({
  prompt: z.string().min(1, 'Prompt cannot be empty').max(32000, 'Prompt exceeds maximum length'),
  taskComplexity: z.enum(['fast', 'reasoning']).optional(),
  systemInstruction: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxOutputTokens: z.number().min(1).max(8192).optional()
});

/**
 * Intelligent Complexity Detector:
 * Auto-detects whether a prompt requires high-speed extraction (Flash) or deep multi-step reasoning (Pro)
 */
function detectComplexity(prompt: string, explicitComplexity?: TaskComplexity): TaskComplexity {
  if (explicitComplexity) return explicitComplexity;
  
  const lower = prompt.toLowerCase();
  const reasoningIndicators = [
    'analyze', 'conflicting', 'contradiction', 'compromise', 'policy',
    'reasoning', 'evaluate', 'synthesize', 'reconcile', 'discrepancy',
    'architect', 'investigate', 'multi-step', 'trade-off', 'due diligence'
  ];

  const matchCount = reasoningIndicators.filter(kw => lower.includes(kw)).length;
  return (matchCount >= 1 || prompt.length > 400) ? 'reasoning' : 'fast';
}

export async function handleGenerateAI(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  const startTime = Date.now();
  const user = req.user!; // Provided by requireAuth middleware
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
  const userAgent = req.headers['user-agent'] || '';

  // 1. Validate Payload
  const validationResult = generateSchema.safeParse(req.body);
  if (!validationResult.success) {
    res.status(400).json({
      success: false,
      error: 'Invalid Request Payload',
      details: validationResult.error.errors
    });
    return;
  }

  const { prompt, taskComplexity: explicitComplexity, systemInstruction, temperature, maxOutputTokens } = validationResult.data;
  const resolvedComplexity = detectComplexity(prompt, explicitComplexity);

  try {
    // 2. Execute Dual-Key Gemini Service (with routing & automatic failover)
    const result = await geminiService.generateContent({
      prompt,
      taskComplexity: resolvedComplexity,
      systemInstruction,
      temperature,
      maxOutputTokens
    });

    // 3. Asynchronously Log Interaction to Supabase (Non-Blocking)
    auditService.logInteractionAsync({
      orgId: user.orgId,
      userId: user.id,
      endpoint: '/api/generate',
      taskComplexity: resolvedComplexity,
      modelRequested: resolvedComplexity === 'fast' ? env.MODEL_FAST : env.MODEL_REASONING,
      modelResolved: result.modelUsed,
      keyAliasUsed: result.keyAliasUsed,
      failoverTriggered: result.failoverTriggered,
      promptText: prompt,
      responseText: result.text,
      promptTokens: result.promptTokens,
      completionTokens: result.completionTokens,
      totalTokens: result.totalTokens,
      latencyMs: result.latencyMs,
      status: 'success',
      clientIp,
      userAgent
    });

    // 4. Respond to Client with Structured Metadata
    const responsePayload: GenerateAIResponseDTO = {
      success: true,
      text: result.text,
      metadata: {
        modelUsed: result.modelUsed,
        keyAliasUsed: result.keyAliasUsed,
        failoverTriggered: result.failoverTriggered,
        taskComplexity: resolvedComplexity,
        promptTokens: result.promptTokens,
        completionTokens: result.completionTokens,
        totalTokens: result.totalTokens,
        latencyMs: result.latencyMs
      }
    };

    res.status(200).json(responsePayload);
  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    const isRateLimited = (error?.message || '').includes('429') || (error?.message || '').includes('rate limit');

    // Asynchronously Log Error Event to Supabase
    auditService.logInteractionAsync({
      orgId: user.orgId,
      userId: user.id,
      endpoint: '/api/generate',
      taskComplexity: resolvedComplexity,
      modelRequested: resolvedComplexity === 'fast' ? env.MODEL_FAST : env.MODEL_REASONING,
      modelResolved: 'failed',
      keyAliasUsed: resolvedComplexity === 'fast' ? 'GEMINI_KEY_1' : 'GEMINI_KEY_2',
      failoverTriggered: true,
      promptText: prompt,
      responseText: null,
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      latencyMs,
      status: isRateLimited ? 'rate_limited' : 'failed',
      errorDetails: error.message,
      clientIp,
      userAgent
    });

    res.status(isRateLimited ? 429 : 500).json({
      success: false,
      error: 'AI Generation Failed',
      message: error.message,
      latencyMs
    });
  }
}
