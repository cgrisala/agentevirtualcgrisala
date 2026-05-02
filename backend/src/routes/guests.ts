import { Router } from 'express';
import { authenticate, authorize } from '../middleware/authentication';
import { validate } from '../middleware/validation';
import { createGuestSchema, updateGuestSchema } from '../validators/schemas';
import { GuestController } from '../controllers/GuestController';

const router = Router();

router.get('/', authenticate, GuestController.getAll);
router.post('/', authenticate, authorize(['admin', 'staff']), validate(createGuestSchema), GuestController.create);
router.get('/:id', authenticate, GuestController.getById);
router.put('/:id', authenticate, authorize(['admin', 'staff']), validate(updateGuestSchema), GuestController.update);

export default router;
