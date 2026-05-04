import { Response } from 'express';
import { TaskUseCases } from '../../application/usecases/task.usecases';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ResponseHelper } from '../../shared/response';
import { CreateTaskDTO, UpdateTaskDTO } from '../../domain/entities/task.entity';

/**
 * Controlador para las operaciones relacionadas con las tareas.
 * Maneja la comunicación entre las peticiones HTTP y los casos de uso.
 */
export class TaskController {
  /**
   * @param taskUseCases Instancia de los casos de uso de tareas.
   */
  constructor(private readonly taskUseCases: TaskUseCases) { }

  /**
   * Obtiene todas las tareas del usuario autenticado.
   * @param req Petición con userId inyectado por el middleware de auth.
   * @param res Respuesta Express.
   */
  getAll = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const lastId = req.query.lastId as string | undefined;
    const result = await this.taskUseCases.getTasks(req.userId!, limit, lastId);
    res.json(ResponseHelper.success(result));
  };

  /**
   * Obtiene una tarea por su ID.
   * @param req Petición Express.
   * @param res Respuesta Express.
   */
  getById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const task = await this.taskUseCases.getTaskById(req.params.id);
    res.json(ResponseHelper.success(task));
  };

  /**
   * Crea una nueva tarea para el usuario autenticado.
   * @param req Petición Express con el cuerpo de la tarea.
   * @param res Respuesta Express (201 Created).
   */
  create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const task = await this.taskUseCases.createTask(req.userId!, req.body as CreateTaskDTO);
    res.status(201).json(ResponseHelper.success(task));
  };

  /**
   * Actualiza una tarea existente.
   * @param req Petición Express con los campos a actualizar.
   * @param res Respuesta Express.
   */
  update = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const task = await this.taskUseCases.updateTask(req.params.id, req.userId!, req.body as UpdateTaskDTO);
    res.json(ResponseHelper.success(task));
  };

  /**
   * Elimina una tarea por su ID.
   * @param req Petición Express.
   * @param res Respuesta Express.
   */
  delete = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    await this.taskUseCases.deleteTask(req.params.id, req.userId!);
    res.json(ResponseHelper.success(null));
  };
}