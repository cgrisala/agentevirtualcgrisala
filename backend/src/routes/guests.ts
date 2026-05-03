import { Router } from 'express';
import { authenticate, authorize } from '../middleware/authentication.js';
import { validate } from '../middleware/validation.js';
import { createGuestSchema, updateGuestSchema } from '../validators/schemas.js';
import { GuestController } from '../controllers/GuestController.js';

const router = Router();

router.get('/', authenticate, GuestController.getAll);
router.post('/', authenticate, authorize(['admin', 'staff']), validate(createGuestSchema), GuestController.create);
router.get('/:id', authenticate, GuestController.getById);
router.put('/:id', authenticate, authorize(['admin', 'staff']), validate(updateGuestSchema), GuestController.update);

export default router;
