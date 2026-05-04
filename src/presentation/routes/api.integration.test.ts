import { describe, it, expect, vi, beforeEach } from 'vitest';
import { app } from '../../index';
import request from 'supertest';
import { TaskUseCases } from './task.usecases';
import { UserUseCases } from './user.usecases';
import { AuthService } from '../services/auth.service';

// Mock the services for integration tests
vi.mock('../services/auth.service', () => ({
  AuthService: vi.fn().mockImplementation(() => ({
    generateToken: vi.fn().mockReturnValue('mock-jwt-token'),
    verifyToken: vi.fn().mockReturnValue({ userId: 'user-1' }),
  })),
}));

describe('API Integration Tests', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
    });
  });

  describe('Tasks API', () => {
    const validToken = 'mock-jwt-token';

    it('should return 401 without authorization header', async () => {
      const response = await request(app).get('/tasks');

      expect(response.status).toBe(401);
    });

    it('should return 401 with invalid token format', async () => {
      const response = await request(app)
        .get('/tasks')
        .set('Authorization', 'InvalidToken');

      expect(response.status).toBe(401);
    });
  });

  describe('Users API', () => {
    it('GET /users/lookup should return 400 without email', async () => {
      const response = await request(app).get('/users/lookup');

      expect(response.status).toBe(400);
    });

    it('GET /users/lookup should return 400 with invalid email', async () => {
      const response = await request(app).get('/users/lookup?email=invalid');

      expect(response.status).toBe(400);
    });

    it('POST /users should return 400 without body', async () => {
      const response = await request(app).post('/users');

      expect(response.status).toBe(400);
    });

    it('POST /users should return 400 with invalid email', async () => {
      const response = await request(app)
        .post('/users')
        .send({ email: 'invalid-email' });

      expect(response.status).toBe(400);
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-route');

      expect(response.status).toBe(404);
    });
  });
});