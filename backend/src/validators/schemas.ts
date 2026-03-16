import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
});

export const createReservationSchema = Joi.object({
  guestId: Joi.string().uuid().required(),
  roomId: Joi.string().uuid().required(),
  checkInDate: Joi.date().required(),
  checkOutDate: Joi.date().min(Joi.ref('checkInDate')).required(),
  notes: Joi.string().max(500),
});

export const updateReservationSchema = Joi.object({
  checkInDate: Joi.date(),
  checkOutDate: Joi.date(),
  status: Joi.string().valid('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'),
  notes: Joi.string().max(500),
});

export const createGuestSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  whatsappPhone: Joi.string(),
  nationality: Joi.string(),
  documentType: Joi.string(),
  documentNumber: Joi.string(),
});

export const updateGuestSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  whatsappPhone: Joi.string(),
  nationality: Joi.string(),
  documentType: Joi.string(),
  documentNumber: Joi.string(),
});
