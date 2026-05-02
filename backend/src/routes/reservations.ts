import { Router } from 'express';
import { authenticate, authorize } from '../middleware/authentication';
import { validate } from '../middleware/validation';
import { createReservationSchema, updateReservationSchema } from '../validators/schemas';
import { ReservationController } from '../controllers/ReservationController';

const router = Router();

router.get('/', authenticate, ReservationController.getAll);
router.post('/', authenticate, authorize(['admin', 'staff']), validate(createReservationSchema), ReservationController.create);
router.get('/:id', authenticate, ReservationController.getById);
router.put('/:id', authenticate, authorize(['admin', 'staff']), validate(updateReservationSchema), ReservationController.update);
router.delete('/:id', authenticate, authorize(['admin']), ReservationController.delete);
router.get('/:id/timeline', authenticate, ReservationController.getTimeline);

export default router;
