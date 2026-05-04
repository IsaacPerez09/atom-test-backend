import { Task, CreateTaskDTO, UpdateTaskDTO } from '../entities/task.entity';
import { User } from '../entities/user.entity';

/**
 * Interfaz para el repositorio de tareas.
 * Define las operaciones permitidas sobre la colección de tareas en la base de datos.
 */
export interface ITaskRepository {
  /**
   * Obtiene todas las tareas de un usuario con soporte para paginación por cursores.
   * @param userId ID del usuario propietario.
   * @param limit Cantidad máxima de tareas a retornar.
   * @param lastId ID de la última tarea de la página anterior (para cursor).
   * @returns Lista de tareas y un booleano indicando si hay más resultados.
   */
  getAll(userId: string, limit?: number, lastId?: string): Promise<{ tasks: Task[], hasMore: boolean }>;

  /**
   * Busca una tarea específica por su ID.
   * @param id ID único de la tarea.
   * @returns La tarea encontrada o null.
   */
  getById(id: string): Promise<Task | null>;

  /**
   * Crea una nueva tarea asociada a un usuario.
   * @param userId ID del usuario propietario.
   * @param data Datos de la tarea a crear.
   * @returns La tarea creada con su ID generado.
   */
  create(userId: string, data: CreateTaskDTO): Promise<Task>;

  /**
   * Actualiza parcialmente una tarea existente.
   * @param id ID de la tarea a actualizar.
   * @param data Campos a modificar.
   * @returns La tarea actualizada.
   */
  update(id: string, data: UpdateTaskDTO): Promise<Task>;

  /**
   * Elimina permanentemente una tarea.
   * @param id ID de la tarea a borrar.
   */
  delete(id: string): Promise<void>;
}

/**
 * Interfaz para el repositorio de usuarios.
 * Define las operaciones permitidas sobre la colección de usuarios.
 */
export interface IUserRepository {
  /**
   * Busca un usuario por su correo electrónico único.
   * @param email Correo a buscar.
   * @returns El usuario encontrado o null.
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Registra un nuevo usuario en el sistema.
   * @param email Correo electrónico del nuevo usuario.
   * @returns El usuario creado.
   */
  create(email: string): Promise<User>;
}