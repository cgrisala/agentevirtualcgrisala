import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema, createReservationSchema } from '../../src/validators/schemas';

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const data = {
        email: 'user@example.com',
        password: 'SecurePass123!'
      };

      const { error } = loginSchema.validate(data);
      expect(error).toBeUndefined();
    });

    it('should require email', () => {
      const data = { password: 'SecurePass123!' };
      const { error } = loginSchema.validate(data);
      expect(error?.message).toContain('email');
    });

    it('should require password', () => {
      const data = { email: 'user@example.com' };
      const { error } = loginSchema.validate(data);
      expect(error?.message).toContain('password');
    });

    it('should reject invalid email', () => {
      const data = {
        email: 'invalid-email',
        password: 'SecurePass123!'
      };

      const { error } = loginSchema.validate(data);
      expect(error?.message).toContain('email');
    });
  });

  describe('createReservationSchema', () => {
    it('should validate reservation data', () => {
      const data = {
        guestId: '123e4567-e89b-12d3-a456-426614174000',
        roomId: '123e4567-e89b-12d3-a456-426614174001',
        checkInDate: new Date('2026-04-01'),
        checkOutDate: new Date('2026-04-05')
      };

      const { error } = createReservationSchema.validate(data);
      expect(error).toBeUndefined();
    });

    it('should require guestId', () => {
      const data = {
        roomId: '123e4567-e89b-12d3-a456-426614174001',
        checkInDate: new Date('2026-04-01'),
        checkOutDate: new Date('2026-04-05')
      };

      const { error } = createReservationSchema.validate(data);
      expect(error?.message).toContain('guestId');
    });

    it('should ensure checkout after checkin', () => {
      const data = {
        guestId: '123e4567-e89b-12d3-a456-426614174000',
        roomId: '123e4567-e89b-12d3-a456-426614174001',
        checkInDate: new Date('2026-04-05'),
        checkOutDate: new Date('2026-04-01')  // Before check-in
      };

      const { error } = createReservationSchema.validate(data);
      expect(error?.message).toBeDefined();
    });
  });
});
