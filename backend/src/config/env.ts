import dotenv from 'dotenv';
import { z } from 'zod';

// Load .env variables
dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),

  // Supabase
  SUPABASE_URL: z.string().transform(url => url.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '')),
  SUPABASE_ANON_KEY: z.string().trim().min(10, 'SUPABASE_ANON_KEY is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().trim().min(10, 'SUPABASE_SERVICE_ROLE_KEY is required'),

  // Dual Gemini API Keys
  GEMINI_API_KEY_1: z.string().trim().min(10, 'GEMINI_API_KEY_1 is required for Flash/Fast routing'),
  GEMINI_API_KEY_2: z.string().trim().min(10, 'GEMINI_API_KEY_2 is required for Pro/Reasoning routing and failover'),

  // Models
  MODEL_FAST: z.string().trim().default('gemini-3.8-flash'),
  MODEL_REASONING: z.string().trim().default('gemini-3.1-pro-preview'),

  AI_REQUEST_TIMEOUT_MS: z.coerce.number().default(30000),
  AI_MAX_RETRIES: z.coerce.number().default(2)
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ FATAL: Invalid Environment Configuration:');
  console.error(parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
