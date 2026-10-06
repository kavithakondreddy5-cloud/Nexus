import app from './app.js';
import { env } from './config/env.js';

const server = app.listen(env.PORT, () => {
  console.log(`================================================================`);
  console.log(`🚀 Nexus Enterprise AI Backend running on port ${env.PORT}`);
  console.log(`📡 Environment: ${env.NODE_ENV}`);
  console.log(`⚡ Model Fast (Key 1): ${env.MODEL_FAST}`);
  console.log(`🧠 Model Reasoning (Key 2): ${env.MODEL_REASONING}`);
  console.log(`🔒 Supabase URL: ${env.SUPABASE_URL}`);
  console.log(`================================================================`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});
