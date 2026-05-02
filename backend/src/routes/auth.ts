import { Router } from 'express';
import { authenticate } from '../middleware/authentication';
import { validate } from '../middleware/validation';
import { loginSchema, registerSchema } from '../validators/schemas';
import { AuthController } from '../controllers/AuthController';

const router = Router();

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.post('/refresh', authenticate, AuthController.refresh);

export default router;
