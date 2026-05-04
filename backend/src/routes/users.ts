import { Router } from 'express';
import { authenticate, authorize } from '../middleware/authentication.js';
import { validate } from '../middleware/validation.js';
import { createGuestSchema, updateGuestSchema } from '../validators/schemas.js';
import { UserController } from '../controllers/UserController.js';

const router = Router();

router.get('/', authenticate, authorize(['admin']), UserController.getAll);
router.post('/', authenticate, authorize(['admin']), validate(createGuestSchema), UserController.create);
router.get('/:id', authenticate, authorize(['admin']), UserController.getById);
router.put('/:id', authenticate, authorize(['admin']), validate(updateGuestSchema), UserController.update);
router.delete('/:id', authenticate, authorize(['admin']), UserController.delete);

export default router;
