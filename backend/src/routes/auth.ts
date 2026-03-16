import { Router } from 'express';
import { authenticate } from '../middleware/authentication';
import { validate } from '../middleware/validation';
import { loginSchema, registerSchema } from '../validators/schemas';

const router = Router();

router.post('/register', validate(registerSchema), async (req, res) => {
  // TODO: Implementar registro
  res.json({ success: true, message: 'Register endpoint' });
});

router.post('/login', validate(loginSchema), async (req, res) => {
  // TODO: Implementar login
  res.json({ success: true, message: 'Login endpoint' });
});

router.post('/refresh', authenticate, async (req, res) => {
  // TODO: Implementar refresh token
  res.json({ success: true, message: 'Refresh endpoint' });
});

export default router;
