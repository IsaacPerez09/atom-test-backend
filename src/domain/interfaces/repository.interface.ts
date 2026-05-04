import { Task, CreateTaskDTO, UpdateTaskDTO } from '../entities/task.entity';
import { User } from '../entities/user.entity';

export interface ITaskRepository {
  getAll(userId: string, limit?: number, lastId?: string): Promise<{ tasks: Task[], hasMore: boolean }>;
  getById(id: string): Promise<Task | null>;
  create(userId: string, data: CreateTaskDTO): Promise<Task>;
  update(id: string, data: UpdateTaskDTO): Promise<Task>;
  delete(id: string): Promise<void>;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(email: string): Promise<User>;
}