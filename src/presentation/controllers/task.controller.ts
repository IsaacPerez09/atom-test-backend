import { Response } from 'express';
import { TaskUseCases } from '../../application/usecases/task.usecases';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ResponseHelper } from '../../shared/response';
import { CreateTaskDTO, UpdateTaskDTO } from '../../domain/entities/task.entity';

export class TaskController {
  constructor(private readonly taskUseCases: TaskUseCases) {}

  getAll = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const lastId = req.query.lastId as string | undefined;
    const result = await this.taskUseCases.getTasks(req.userId!, limit, lastId);
    res.json(ResponseHelper.success(result));
  };

  getById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const task = await this.taskUseCases.getTaskById(req.params.id);
    res.json(ResponseHelper.success(task));
  };

  create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const task = await this.taskUseCases.createTask(req.userId!, req.body as CreateTaskDTO);
    res.status(201).json(ResponseHelper.success(task));
  };

  update = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const task = await this.taskUseCases.updateTask(req.params.id, req.userId!, req.body as UpdateTaskDTO);
    res.json(ResponseHelper.success(task));
  };

  delete = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    await this.taskUseCases.deleteTask(req.params.id, req.userId!);
    res.json(ResponseHelper.success(null));
  };
}