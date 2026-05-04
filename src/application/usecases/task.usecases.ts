import { ITaskRepository } from '../../domain/interfaces/repository.interface';
import { Task, CreateTaskDTO, UpdateTaskDTO, CreateTaskSchema, UpdateTaskSchema } from '../../domain/entities/task.entity';
import { NotFoundError, UnauthorizedError } from '../../shared/errors/app.error';
import { AppMessages } from '../../shared/enums/messages.enum';

/**
 * Clase que orquesta la lógica de negocio para las tareas.
 * Se encarga de la validación de datos, verificación de autoría y comunicación con el repositorio.
 */
export class TaskUseCases {
  /**
   * @param taskRepository Instancia del repositorio de tareas.
   */
  constructor(private readonly taskRepository: ITaskRepository) { }

  /**
   * Obtiene las tareas de un usuario con paginación.
   * @param userId ID del usuario que solicita sus tareas.
   * @param limit Límite de elementos por página.
   * @param lastId Cursor para la paginación (ID del último elemento previo).
   * @returns Objeto con lista de tareas y flag hasMore.
   */
  async getTasks(userId: string, limit?: number, lastId?: string): Promise<{ tasks: Task[], hasMore: boolean }> {
    return await this.taskRepository.getAll(userId, limit, lastId);
  }

  /**
   * Obtiene una tarea por su ID.
   * @param id ID de la tarea.
   * @throws {NotFoundError} Si la tarea no existe.
   * @returns La tarea encontrada.
   */
  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskRepository.getById(id);
    if (!task) {
      throw new NotFoundError(AppMessages.TAREA_NO_ENCONTRADA);
    }
    return task;
  }

  /**
   * Crea una nueva tarea después de validar los datos.
   * @param userId ID del usuario creador.
   * @param data Datos de la tarea (título y descripción).
   * @returns La tarea creada.
   */
  async createTask(userId: string, data: CreateTaskDTO): Promise<Task> {
    const validatedData = CreateTaskSchema.parse(data);
    return await this.taskRepository.create(userId, { ...validatedData, title: validatedData.title.trim() });
  }

  /**
   * Actualiza una tarea validando que el usuario sea el propietario.
   * @param id ID de la tarea a actualizar.
   * @param userId ID del usuario que intenta actualizar.
   * @param data Nuevos datos para la tarea.
   * @throws {NotFoundError} Si la tarea no existe.
   * @throws {UnauthorizedError} Si el usuario no es el dueño de la tarea.
   * @returns La tarea actualizada.
   */
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

  /**
   * Elimina una tarea validando que el usuario sea el propietario.
   * @param id ID de la tarea a eliminar.
   * @param userId ID del usuario que intenta eliminar.
   * @throws {NotFoundError} Si la tarea no existe.
   * @throws {UnauthorizedError} Si el usuario no es el dueño.
   */
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