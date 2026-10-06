import { GoogleGenerativeAI, GenerateContentResult } from '@google/generative-ai';
import { env } from '../config/env.js';
import { TaskComplexity, GeminiKeyAlias } from '../types/index.js';

interface GeminiExecutionPlan {
  primaryKey: GeminiKeyAlias;
  primaryClient: GoogleGenerativeAI;
  primaryModel: string;
  fallbackKey: GeminiKeyAlias;
  fallbackClient: GoogleGenerativeAI;
  fallbackModel: string;
}

export interface GeminiExecutionResult {
  text: string;
  keyAliasUsed: GeminiKeyAlias;
  modelUsed: string;
  failoverTriggered: boolean;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
}

export class GeminiService {
  private clientKey1: GoogleGenerativeAI;
  private clientKey2: GoogleGenerativeAI;

  constructor() {
    this.clientKey1 = new GoogleGenerativeAI(env.GEMINI_API_KEY_1);
    this.clientKey2 = new GoogleGenerativeAI(env.GEMINI_API_KEY_2);
  }

  /**
   * Determine Execution Plan based on Workload Routing rules.
   * - 'fast' (Lightweight / low latency): Routes to Key 1 (Gemini Flash).
   * - 'reasoning' (Deep multi-hop / analysis): Routes to Key 2 (Gemini Pro).
   */
  private getExecutionPlan(complexity: TaskComplexity): GeminiExecutionPlan {
    if (complexity === 'fast') {
      return {
        primaryKey: 'GEMINI_KEY_1',
        primaryClient: this.clientKey1,
        primaryModel: env.MODEL_FAST,
        fallbackKey: 'GEMINI_KEY_2',
        fallbackClient: this.clientKey2,
        fallbackModel: env.MODEL_FAST // Fallback to Flash model on Key 2
      };
    } else {
      return {
        primaryKey: 'GEMINI_KEY_2',
        primaryClient: this.clientKey2,
        primaryModel: env.MODEL_REASONING,
        fallbackKey: 'GEMINI_KEY_1',
        fallbackClient: this.clientKey1,
        fallbackModel: env.MODEL_REASONING // Fallback to Pro model on Key 1
      };
    }
  }

  /**
   * Helper to detect retryable rate-limit or timeout errors.
   */
  private isRateLimitOrTimeoutError(error: any): boolean {
    const errorStr = (error?.message || '').toLowerCase();
    const status = error?.status || error?.statusCode;

    return (
      status === 429 ||
      status === 503 ||
      status === 504 ||
      errorStr.includes('429') ||
      errorStr.includes('resource_exhausted') ||
      errorStr.includes('quota') ||
      errorStr.includes('rate limit') ||
      errorStr.includes('timed out') ||
      errorStr.includes('timeout') ||
      errorStr.includes('service unavailable')
    );
  }

  /**
   * Centralized Execution Engine with Workload Routing & Automatic Failover.
   */
  public async generateContent(params: {
    prompt: string;
    taskComplexity?: TaskComplexity;
    systemInstruction?: string;
    temperature?: number;
    maxOutputTokens?: number;
  }): Promise<GeminiExecutionResult> {
    const complexity: TaskComplexity = params.taskComplexity || 'fast';
    const plan = this.getExecutionPlan(complexity);
    const startTime = Date.now();

    // 1. Try Primary Key Route
    try {
      console.log(`[AI Routing] Dispatching '${complexity}' task to ${plan.primaryKey} (${plan.primaryModel})`);

      const model = plan.primaryClient.getGenerativeModel({
        model: plan.primaryModel,
        systemInstruction: params.systemInstruction,
        generationConfig: {
          temperature: params.temperature ?? 0.4,
          maxOutputTokens: params.maxOutputTokens ?? 2048
        }
      });

      const response: GenerateContentResult = await model.generateContent(params.prompt);
      const text = response.response.text();
      const usageMetadata = response.response.usageMetadata;
      const latencyMs = Date.now() - startTime;

      return {
        text,
        keyAliasUsed: plan.primaryKey,
        modelUsed: plan.primaryModel,
        failoverTriggered: false,
        promptTokens: usageMetadata?.promptTokenCount ?? 0,
        completionTokens: usageMetadata?.candidatesTokenCount ?? 0,
        totalTokens: usageMetadata?.totalTokenCount ?? 0,
        latencyMs
      };
    } catch (primaryError: any) {
      console.warn(`⚠️ [AI Routing Warning] Primary key ${plan.primaryKey} encountered an error:`, primaryError.message);

      // Check if error qualifies for automatic failover
      if (this.isRateLimitOrTimeoutError(primaryError)) {
        console.warn(`🔄 [Failover Active] Rate limit (429) or timeout detected. Failing over to ${plan.fallbackKey}...`);

        try {
          const fallbackModel = plan.fallbackClient.getGenerativeModel({
            model: plan.fallbackModel,
            systemInstruction: params.systemInstruction,
            generationConfig: {
              temperature: params.temperature ?? 0.4,
              maxOutputTokens: params.maxOutputTokens ?? 2048
            }
          });

          const fallbackResponse: GenerateContentResult = await fallbackModel.generateContent(params.prompt);
          const text = fallbackResponse.response.text();
          const usageMetadata = fallbackResponse.response.usageMetadata;
          const latencyMs = Date.now() - startTime;

          console.log(`✅ [Failover Success] Successfully resolved request using fallback ${plan.fallbackKey} (${plan.fallbackModel})`);

          return {
            text,
            keyAliasUsed: plan.fallbackKey,
            modelUsed: plan.fallbackModel,
            failoverTriggered: true,
            promptTokens: usageMetadata?.promptTokenCount ?? 0,
            completionTokens: usageMetadata?.candidatesTokenCount ?? 0,
            totalTokens: usageMetadata?.totalTokenCount ?? 0,
            latencyMs
          };
        } catch (fallbackError: any) {
          // Resilient Cross-Model Failover: If Pro hits 429 quota on both keys, route to high-throughput Flash on Key 1
          if (this.isRateLimitOrTimeoutError(fallbackError) && plan.fallbackModel !== env.MODEL_FAST) {
            console.warn(`🔄 [Cross-Model Failover] Quota limit on Pro model; seamlessly routing to ${env.MODEL_FAST} on GEMINI_KEY_1...`);
            
            const emergencyModel = this.clientKey1.getGenerativeModel({
              model: env.MODEL_FAST,
              systemInstruction: params.systemInstruction,
              generationConfig: {
                temperature: params.temperature ?? 0.4,
                maxOutputTokens: params.maxOutputTokens ?? 2048
              }
            });

            const emergencyResponse = await emergencyModel.generateContent(params.prompt);
            const text = emergencyResponse.response.text();
            const usageMetadata = emergencyResponse.response.usageMetadata;
            const latencyMs = Date.now() - startTime;

            console.log(`✅ [Failover Success] Successfully recovered via emergency route GEMINI_KEY_1 (${env.MODEL_FAST})`);

            return {
              text,
              keyAliasUsed: 'GEMINI_KEY_1',
              modelUsed: env.MODEL_FAST,
              failoverTriggered: true,
              promptTokens: usageMetadata?.promptTokenCount ?? 0,
              completionTokens: usageMetadata?.candidatesTokenCount ?? 0,
              totalTokens: usageMetadata?.totalTokenCount ?? 0,
              latencyMs
            };
          }

          console.error(`❌ [Failover Exhausted] Fallback key ${plan.fallbackKey} also failed:`, fallbackError.message);
          throw new Error(`AI Gateway Error: All configured API keys failed. Primary error: ${primaryError.message}. Fallback error: ${fallbackError.message}`);
        }
      }

      // Non-rate-limit error (e.g. invalid argument, safety block)
      throw primaryError;
    }
  }
}

export const geminiService = new GeminiService();
