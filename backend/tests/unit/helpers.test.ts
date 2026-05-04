import { describe, it, expect } from 'vitest';
import { 
  isValidEmail, 
  isValidPhone, 
  sleep, 
  extractPhoneNumber,
  getDaysDifference 
} from '../../src/utils/helpers';

describe('Helper Functions', () => {
  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.user@example.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should validate phone numbers', () => {
      expect(isValidPhone('+34-999-888-777')).toBe(true);
      expect(isValidPhone('999888777')).toBe(true);
      expect(isValidPhone('+54 9 11 1234 5678')).toBe(true);
    });

    it('should reject invalid phones', () => {
      expect(isValidPhone('abc')).toBe(false);
      expect(isValidPhone('')).toBe(false);
    });
  });

  describe('extractPhoneNumber', () => {
    it('should extract digits from phone', () => {
      expect(extractPhoneNumber('+34-999-888-777')).toBe('34999888777');
      expect(extractPhoneNumber('(999) 888-777')).toBe('999888777');
    });
  });

  describe('getDaysDifference', () => {
    it('should calculate days between dates', () => {
      const start = new Date('2026-04-01');
      const end = new Date('2026-04-05');
      expect(getDaysDifference(start, end)).toBe(4);
    });

    it('should handle same date', () => {
      const date = new Date('2026-04-01');
      expect(getDaysDifference(date, date)).toBe(0);
    });
  });

  describe('sleep', () => {
    it('should delay execution', async () => {
      const start = Date.now();
      await sleep(100);
      const duration = Date.now() - start;
      expect(duration).toBeGreaterThanOrEqual(100);
    });
  });
});
