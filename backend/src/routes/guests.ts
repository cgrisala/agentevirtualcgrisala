import { Router } from 'express';
import { authenticate, authorize } from '../middleware/authentication';
import { validate } from '../middleware/validation';
import { createGuestSchema, updateGuestSchema } from '../validators/schemas';

const router = Router();

// GET /api/guests
router.get('/', authenticate, async (req, res) => {
  // TODO: Implementar listado de huéspedes
  res.json({ success: true, data: [], message: 'List guests' });
});

// POST /api/guests
router.post('/', 
  authenticate, 
  authorize(['admin', 'staff']), 
  validate(createGuestSchema), 
  async (req, res) => {
  // TODO: Implementar creación de huéspedes
  res.status(201).json({ success: true, message: 'Create guest' });
});

// GET /api/guests/:id
router.get('/:id', authenticate, async (req, res) => {
  // TODO: Implementar obtener huésped
  res.json({ success: true, message: 'Get guest' });
});

// PUT /api/guests/:id
router.put('/:id', 
  authenticate, 
  authorize(['admin', 'staff']), 
  validate(updateGuestSchema), 
  async (req, res) => {
  // TODO: Implementar actualización de huéspedes
  res.json({ success: true, message: 'Update guest' });
});

export default router;
