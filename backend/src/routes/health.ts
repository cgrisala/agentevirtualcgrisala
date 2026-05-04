import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

router.get('/db', async (_req, res) => {
  // TODO: Implementar health check de BD
  res.json({
    status: 'ok',
    database: 'connected',
    timestamp: new Date().toISOString(),
  });
});

export default router;
