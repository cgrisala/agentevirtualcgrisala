import { Router } from 'express';

const router = Router();

// Webhook de n8n
router.post('/n8n', async (req, res) => {
  // TODO: Procesar webhooks de n8n
  res.json({ success: true, message: 'n8n webhook received' });
});

// Webhook de Evolution API (WhatsApp)
router.post('/evolution', async (req, res) => {
  // TODO: Procesar webhooks de Evolution API
  res.json({ success: true, message: 'Evolution webhook received' });
});

export default router;
