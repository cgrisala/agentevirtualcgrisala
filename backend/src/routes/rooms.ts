import { Router } from 'express';
import { authenticate, authorize } from '../middleware/authentication.js';
import { validate } from '../middleware/validation.js';
import { createRoomSchema, updateRoomSchema } from '../validators/schemas.js';
import { RoomController } from '../controllers/RoomController.js';

const router = Router();

router.get('/', authenticate, RoomController.getAll);
router.post('/', authenticate, authorize(['admin']), validate(createRoomSchema), RoomController.create);
router.get('/:id', authenticate, RoomController.getById);
router.put('/:id', authenticate, authorize(['admin']), validate(updateRoomSchema), RoomController.update);
router.delete('/:id', authenticate, authorize(['admin']), RoomController.delete);

export default router;
