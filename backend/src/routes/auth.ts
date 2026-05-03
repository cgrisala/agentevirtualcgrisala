import { Router } from 'express';
import { authenticate } from '../middleware/authentication.js';
import { validate } from '../middleware/validation.js';
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/schemas.js';
import { AuthController } from '../controllers/AuthController.js';

const router = Router();

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.post('/forgot-password', validate(forgotPasswordSchema), AuthController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), AuthController.resetPassword);
router.post('/refresh', authenticate, AuthController.refresh);

export default router;
