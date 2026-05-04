import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserUseCases } from './user.usecases';
import { IUserRepository } from '../../domain/interfaces/repository.interface';
import { User } from '../../domain/entities/user.entity';
import { AuthService } from '../services/auth.service';
import { ConflictError } from '../../shared/errors/app.error';

describe('UserUseCases', () => {
  let userUseCases: UserUseCases;
  let mockUserRepository: IUserRepository;
  let mockAuthService: AuthService;

  const mockUser: User = {
    id: 'user-1',
    email: 'test@example.com',
    createdAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: vi.fn(),
      create: vi.fn(),
    };
    mockAuthService = {
      generateToken: vi.fn().mockReturnValue('mock-token'),
    };
    userUseCases = new UserUseCases(mockUserRepository, mockAuthService);
  });

  describe('findUserByEmail', () => {
    it('should return user data when user exists', async () => {
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(mockUser);

      const result = await userUseCases.findUserByEmail('test@example.com');

      expect(result.exists).toBe(true);
      expect(result.user).toEqual(mockUser);
      expect(result.token).toBe('mock-token');
    });

    it('should return exists: false when user not found', async () => {
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);

      const result = await userUseCases.findUserByEmail('nonexistent@example.com');

      expect(result.exists).toBe(false);
      expect(result.user).toBeNull();
      expect(result.token).toBeUndefined();
    });

    it('should normalize email before search', async () => {
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(mockUser);

      await userUseCases.findUserByEmail('Test@Example.com');

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    });
  });

  describe('createUser', () => {
    it('should create new user with token', async () => {
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);
      vi.mocked(mockUserRepository.create).mockResolvedValue(mockUser);

      const result = await userUseCases.createUser('new@example.com');

      expect(result.user).toEqual(mockUser);
      expect(result.token).toBe('mock-token');
      expect(mockAuthService.generateToken).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw ConflictError when email already exists', async () => {
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(mockUser);

      await expect(userUseCases.createUser('test@example.com'))
        .rejects.toThrow(ConflictError);
    });

    it('should normalize email before checking', async () => {
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(mockUser);

      await expect(userUseCases.createUser('Test@Example.com'))
        .rejects.toThrow(ConflictError);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    });
  });
});