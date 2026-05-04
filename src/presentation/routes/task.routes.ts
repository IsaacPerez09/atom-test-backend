import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { TaskRepository } from '../../infrastructure/repositories/task.repository';
import { TaskUseCases } from '../../application/usecases/task.usecases';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { db } from '../../config/firebase.config';
import { asyncHandler } from '../../shared/utils/async.wrapper';
import { CreateTaskSchema, UpdateTaskSchema } from '../../domain/entities/task.entity';

const taskRepository = new TaskRepository(db);
const taskUseCases = new TaskUseCases(taskRepository);
const taskController = new TaskController(taskUseCases);

export const taskRouter = Router();

taskRouter.use(authMiddleware);

taskRouter.get('/', asyncHandler(taskController.getAll));
taskRouter.get('/:id', asyncHandler(taskController.getById));
taskRouter.post('/', validateBody(CreateTaskSchema), asyncHandler(taskController.create));
taskRouter.patch('/:id', validateBody(UpdateTaskSchema), asyncHandler(taskController.update));
taskRouter.delete('/:id', asyncHandler(taskController.delete));