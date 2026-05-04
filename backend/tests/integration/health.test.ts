import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../src/index';

describe('Health Check Endpoints', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('uptime');
      expect(res.body).toHaveProperty('environment');
    });

    it('should have valid timestamp format', async () => {
      const res = await request(app).get('/health');
      const timestamp = new Date(res.body.timestamp);
      expect(timestamp instanceof Date && !isNaN(timestamp.getTime())).toBe(true);
    });
  });

  describe('GET /health/db', () => {
    it('should return database health status', async () => {
      const res = await request(app).get('/health/db');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status');
      expect(res.body).toHaveProperty('database');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('404 Routes', () => {
    it('should return 404 for non-existent routes', async () => {
      const res = await request(app).get('/non-existent-route');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });
});
