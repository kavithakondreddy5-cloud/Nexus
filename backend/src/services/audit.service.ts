import { supabaseAdmin } from '../config/supabase.js';
import { AIInteractionLogEntry } from '../types/index.js';

export class AuditService {
  /**
   * Asynchronously logs AI generation events into Supabase ai_interactions_log.
   * Runs in non-blocking mode to keep API response latency minimal.
   */
  public logInteractionAsync(entry: AIInteractionLogEntry): void {
    setImmediate(async () => {
      try {
        const { error } = await supabaseAdmin.from('ai_interactions_log').insert({
          org_id: entry.orgId,
          user_id: entry.userId,
          endpoint: entry.endpoint,
          task_complexity: entry.taskComplexity,
          model_requested: entry.modelRequested,
          model_resolved: entry.modelResolved,
          key_alias_used: entry.keyAliasUsed,
          failover_triggered: entry.failoverTriggered,
          prompt_text: entry.promptText,
          response_text: entry.responseText,
          prompt_tokens: entry.promptTokens,
          completion_tokens: entry.completionTokens,
          total_tokens: entry.totalTokens,
          latency_ms: entry.latencyMs,
          status: entry.status,
          error_details: entry.errorDetails || null,
          client_ip: entry.clientIp || null,
          user_agent: entry.userAgent || null
        });

        if (error) {
          console.error('⚠️ [Audit Log Error] Failed to write to ai_interactions_log:', error.message);
        } else {
          console.log(`📝 [Audit Log] Recorded AI interaction for user ${entry.userId} (${entry.keyAliasUsed}, ${entry.latencyMs}ms)`);
        }
      } catch (err: any) {
        console.error('⚠️ [Audit Log Exception] Unhandled exception in audit logger:', err.message);
      }
    });
  }
}

export const auditService = new AuditService();
