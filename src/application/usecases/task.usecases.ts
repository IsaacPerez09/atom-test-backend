import { ITaskRepository } from '../../domain/interfaces/repository.interface';
import { Task, CreateTaskDTO, UpdateTaskDTO, CreateTaskSchema, UpdateTaskSchema } from '../../domain/entities/task.entity';
import { NotFoundError, UnauthorizedError } from '../../shared/errors/app.error';
import { AppMessages } from '../../shared/enums/messages.enum';

export class TaskUseCases {
  constructor(private readonly taskRepository: ITaskRepository) { }

  async getTasks(userId: string, limit?: number, lastId?: string): Promise<{ tasks: Task[], hasMore: boolean }> {
    return await this.taskRepository.getAll(userId, limit, lastId);
  }

  async getTaskById(id: string): Promise<Task> {

    const task = await this.taskRepository.getById(id);

    if (!task) {
      throw new NotFoundError(AppMessages.TAREA_NO_ENCONTRADA);
    }

    return task;

  }

  async createTask(userId: string, data: CreateTaskDTO): Promise<Task> {

    const validatedData = CreateTaskSchema.parse(data);
    return await this.taskRepository.create(userId, { ...validatedData, title: validatedData.title.trim() });

  }

  async updateTask(id: string, userId: string, data: UpdateTaskDTO): Promise<Task> {

    const validatedData = UpdateTaskSchema.parse(data);
    const task = await this.taskRepository.getById(id);

    if (!task) {
      throw new NotFoundError(AppMessages.TAREA_NO_ENCONTRADA);
    }

    if (task.userId !== userId) {
      throw new UnauthorizedError(AppMessages.NO_AUTORIZADO);
    }

    return await this.taskRepository.update(id, validatedData);

  }

  async deleteTask(id: string, userId: string): Promise<void> {

    const task = await this.taskRepository.getById(id);

    if (!task) {
      throw new NotFoundError(AppMessages.TAREA_NO_ENCONTRADA);
    }

    if (task.userId !== userId) {
      throw new UnauthorizedError(AppMessages.NO_AUTORIZADO);
    }

    await this.taskRepository.delete(id);

  }
}