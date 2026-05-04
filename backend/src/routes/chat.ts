import { Router } from 'express';
import { authenticate } from '../middleware/authentication.js';
import { ChatController } from '../controllers/ChatController.js';

const router = Router();

router.post('/send', authenticate, ChatController.sendMessage);

export default router;
