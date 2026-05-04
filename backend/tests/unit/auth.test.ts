import { describe, it, expect } from 'vitest';
import jwt from 'jsonwebtoken';

describe('JWT Authentication', () => {
  const secret = 'test-secret-key-for-testing';
  const userId = 'test-user-id';
  const email = 'test@example.com';

  it('should generate valid JWT', () => {
    const token = jwt.sign(
      { userId, email, role: 'admin' },
      secret,
      { expiresIn: '24h' }
    );

    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3); // JWT has 3 parts
  });

  it('should verify token', () => {
    const token = jwt.sign(
      { userId, email, role: 'admin' },
      secret,
      { expiresIn: '24h' }
    );

    const decoded = jwt.verify(token, secret) as any;
    expect(decoded.userId).toBe(userId);
    expect(decoded.email).toBe(email);
    expect(decoded.role).toBe('admin');
  });

  it('should reject invalid token', () => {
    const invalidToken = 'invalid.token.here';
    
    expect(() => {
      jwt.verify(invalidToken, secret);
    }).toThrow();
  });

  it('should reject expired token', () => {
    const expiredToken = jwt.sign(
      { userId, email },
      secret,
      { expiresIn: '-1h' } // Already expired
    );

    expect(() => {
      jwt.verify(expiredToken, secret);
    }).toThrow();
  });
});
