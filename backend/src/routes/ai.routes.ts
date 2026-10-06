import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { handleGenerateAI } from '../controllers/ai.controller.js';

const router = Router();

/**
 * Health check endpoint for container orchestrators (e.g. AWS ECS / Cloud Run)
 */
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'nexus-ai-backend',
    routingStrategy: 'Dual Gemini Keys (Workload + Failover)'
  });
});

/**
 * Core AI Generation Endpoint
 * Protected by Supabase JWT Auth Middleware
 */
router.post('/generate', requireAuth, handleGenerateAI);

export const aiRoutes = router;
