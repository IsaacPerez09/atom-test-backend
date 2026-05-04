import { Firestore, DocumentSnapshot } from '@google-cloud/firestore';
import { Task, CreateTaskDTO, UpdateTaskDTO } from '../../domain/entities/task.entity';
import { ITaskRepository } from '../../domain/interfaces/repository.interface';
import { FirestoreRepository } from './base.repository';

/**
 * Implementación de ITaskRepository para Cloud Firestore.
 */
export class TaskRepository extends FirestoreRepository<Task> implements ITaskRepository {
  /**
   * @param db Instancia de Firestore.
   */
  constructor(db: Firestore) {
    super(db, 'tasks');
  }

  /**
   * Obtiene la lista de tareas de un usuario específico.
   * @param userId ID del usuario.
   * @param limit Cantidad de resultados por página.
   * @param lastId ID del documento para continuar la paginación.
   * @returns Objeto con las tareas y flag de hasMore.
   */
  async getAll(userId: string, limit: number = 5, lastId?: string): Promise<{ tasks: Task[], hasMore: boolean }> {
    let query = this.collection
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (lastId) {
      const lastDoc = await this.collection.doc(lastId).get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    const snapshot = await query.get();
    const tasks = snapshot.docs.map(doc => this.mapToEntity(doc));
    const hasMore = tasks.length === limit;

    return { tasks, hasMore };
  }

  /**
   * Recupera una tarea por su identificador.
   * @param id ID de la tarea.
   */
  async getById(id: string): Promise<Task | null> {
    const doc = await this.collection.doc(id).get();
    return doc.exists ? this.mapToEntity(doc) : null;
  }

  /**
   * Persiste una nueva tarea en Firestore.
   * @param userId Propietario de la tarea.
   * @param data Datos básicos de la tarea.
   */
  async create(userId: string, data: CreateTaskDTO): Promise<Task> {

    const taskRef = this.collection.doc();
    const now = new Date();

    const task: Task = {
      id: taskRef.id,
      userId,
      title: data.title,
      description: data.description,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    await taskRef.set(task);

    return task;
  }

  /**
   * Actualiza los campos de una tarea.
   * @param id ID de la tarea.
   * @param data Campos a actualizar.
   */
  async update(id: string, data: UpdateTaskDTO): Promise<Task> {

    const docRef = this.collection.doc(id);
    const updateData: Record<string, unknown> = { ...data, updatedAt: new Date() };
    await docRef.update(updateData);
    const doc = await docRef.get();
    return this.mapToEntity(doc);
  }

  /**
   * Elimina un documento de tarea.
   * @param id ID de la tarea a eliminar.
   */
  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }

  /**
   * Mapea los datos crudos de Firestore a una entidad de tipo Task.
   * @param doc Snapshot del documento.
   * @returns Entidad Task.
   */
  protected mapToEntity(doc: DocumentSnapshot): Task {
    const data = doc.data()!;

    return {
      id: doc.id,
      userId: data.userId,
      title: data.title,
      description: data.description || '',
      completed: data.completed || false,
      createdAt: this.parseDate(data.createdAt),
      updatedAt: this.parseDate(data.updatedAt),
    };
  }
}