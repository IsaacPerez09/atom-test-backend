import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskUseCases } from './task.usecases';
import { ITaskRepository } from '../../domain/interfaces/repository.interface';
import { Task, CreateTaskDTO, UpdateTaskDTO } from '../../domain/entities/task.entity';
import { NotFoundError, UnauthorizedError } from '../../shared/errors/app.error';

describe('TaskUseCases', () => {
  let taskUseCases: TaskUseCases;
  let mockTaskRepository: ITaskRepository;

  const mockTask: Task = {
    id: 'task-1',
    userId: 'user-1',
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    mockTaskRepository = {
      getAll: vi.fn(),
      getById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    taskUseCases = new TaskUseCases(mockTaskRepository);
  });

  describe('getTasks', () => {
    it('should return tasks for a user', async () => {
      const mockTasks = { tasks: [mockTask], hasMore: false };
      vi.mocked(mockTaskRepository.getAll).mockResolvedValue(mockTasks);

      const result = await taskUseCases.getTasks('user-1');

      expect(result).toEqual(mockTasks);
      expect(mockTaskRepository.getAll).toHaveBeenCalledWith('user-1', undefined, undefined);
    });

    it('should pass limit and lastId to repository', async () => {
      const mockTasks = { tasks: [mockTask], hasMore: true };
      vi.mocked(mockTaskRepository.getAll).mockResolvedValue(mockTasks);

      const result = await taskUseCases.getTasks('user-1', 10, 'task-0');

      expect(result).toEqual(mockTasks);
      expect(mockTaskRepository.getAll).toHaveBeenCalledWith('user-1', 10, 'task-0');
    });
  });

  describe('getTaskById', () => {
    it('should return task when found', async () => {
      vi.mocked(mockTaskRepository.getById).mockResolvedValue(mockTask);

      const result = await taskUseCases.getTaskById('task-1');

      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundError when task not found', async () => {
      vi.mocked(mockTaskRepository.getById).mockResolvedValue(null);

      await expect(taskUseCases.getTaskById('task-nonexistent')).rejects.toThrow(NotFoundError);
    });
  });

  describe('createTask', () => {
    it('should create task with trimmed title', async () => {
      const createData: CreateTaskDTO = { title: '  New Task  ', description: 'Description' };
      const createdTask = { ...mockTask, title: 'New Task' };
      vi.mocked(mockTaskRepository.create).mockResolvedValue(createdTask);

      const result = await taskUseCases.createTask('user-1', createData);

      expect(result.title).toBe('New Task');
      expect(mockTaskRepository.create).toHaveBeenCalledWith('user-1', { title: 'New Task', description: 'Description' });
    });
  });

  describe('updateTask', () => {
    it('should update task when user is owner', async () => {
      const updateData: UpdateTaskDTO = { title: 'Updated Title' };
      const updatedTask = { ...mockTask, title: 'Updated Title' };
      vi.mocked(mockTaskRepository.getById).mockResolvedValue(mockTask);
      vi.mocked(mockTaskRepository.update).mockResolvedValue(updatedTask);

      const result = await taskUseCases.updateTask('task-1', 'user-1', updateData);

      expect(result.title).toBe('Updated Title');
    });

    it('should throw NotFoundError when task not found', async () => {
      vi.mocked(mockTaskRepository.getById).mockResolvedValue(null);

      await expect(taskUseCases.updateTask('task-nonexistent', 'user-1', { title: 'New' }))
        .rejects.toThrow(NotFoundError);
    });

    it('should throw UnauthorizedError when user is not owner', async () => {
      vi.mocked(mockTaskRepository.getById).mockResolvedValue(mockTask);

      await expect(taskUseCases.updateTask('task-1', 'other-user', { title: 'Hacked' }))
        .rejects.toThrow(UnauthorizedError);
    });
  });

  describe('deleteTask', () => {
    it('should delete task when user is owner', async () => {
      vi.mocked(mockTaskRepository.getById).mockResolvedValue(mockTask);
      vi.mocked(mockTaskRepository.delete).mockResolvedValue();

      await taskUseCases.deleteTask('task-1', 'user-1');

      expect(mockTaskRepository.delete).toHaveBeenCalledWith('task-1');
    });

    it('should throw NotFoundError when task not found', async () => {
      vi.mocked(mockTaskRepository.getById).mockResolvedValue(null);

      await expect(taskUseCases.deleteTask('task-nonexistent', 'user-1'))
        .rejects.toThrow(NotFoundError);
    });

    it('should throw UnauthorizedError when user is not owner', async () => {
      vi.mocked(mockTaskRepository.getById).mockResolvedValue(mockTask);

      await expect(taskUseCases.deleteTask('task-1', 'other-user'))
        .rejects.toThrow(UnauthorizedError);
    });
  });
});