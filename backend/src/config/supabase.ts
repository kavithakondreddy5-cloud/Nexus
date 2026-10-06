import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env.js';

/**
 * High-privilege Supabase Admin Client.
 * Uses SUPABASE_SERVICE_ROLE_KEY to bypass Row Level Security.
 * STRICTLY for backend tasks: audit logging, system metrics, and background ingestion.
 */
export const supabaseAdmin: SupabaseClient = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

/**
 * Creates an authenticated Supabase client scoped to a user's Bearer JWT.
 * Respects all database Row Level Security (RLS) policies.
 */
export function createSupabaseUserClient(jwtToken: string): SupabaseClient {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${jwtToken}`
      }
    },
    auth: {
      persistSession: false
    }
  });
}
