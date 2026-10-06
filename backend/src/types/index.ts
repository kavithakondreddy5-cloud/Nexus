import { Request } from 'express';

export type TaskComplexity = 'fast' | 'reasoning';
export type GeminiKeyAlias = 'GEMINI_KEY_1' | 'GEMINI_KEY_2';

export interface GenerateAIRequestDTO {
  prompt: string;
  taskComplexity?: TaskComplexity; // 'fast' -> Key 1 (Flash), 'reasoning' -> Key 2 (Pro)
  systemInstruction?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export interface GenerateAIResponseDTO {
  success: boolean;
  text: string;
  metadata: {
    modelUsed: string;
    keyAliasUsed: GeminiKeyAlias;
    failoverTriggered: boolean;
    taskComplexity: TaskComplexity;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    latencyMs: number;
  };
}

export interface AuthUserProfile {
  id: string;
  email: string;
  orgId: string;
  role: string;
  securityClearanceLevel: number;
  aclGroups: string[];
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUserProfile;
}

export interface AIInteractionLogEntry {
  orgId: string;
  userId: string;
  endpoint: string;
  taskComplexity: TaskComplexity;
  modelRequested: string;
  modelResolved: string;
  keyAliasUsed: GeminiKeyAlias;
  failoverTriggered: boolean;
  promptText: string;
  responseText: string | null;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  status: 'success' | 'rate_limited' | 'failed';
  errorDetails?: string | null;
  clientIp?: string;
  userAgent?: string;
}
