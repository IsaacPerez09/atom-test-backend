import { Firestore, DocumentSnapshot } from '@google-cloud/firestore';
import { Task, CreateTaskDTO, UpdateTaskDTO } from '../../domain/entities/task.entity';
import { ITaskRepository } from '../../domain/interfaces/repository.interface';
import { FirestoreRepository } from './base.repository';

export class TaskRepository extends FirestoreRepository<Task> implements ITaskRepository {
  constructor(db: Firestore) {
    super(db, 'tasks');
  }

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

  async getById(id: string): Promise<Task | null> {
    const doc = await this.collection.doc(id).get();
    return doc.exists ? this.mapToEntity(doc) : null;
  }

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

  async update(id: string, data: UpdateTaskDTO): Promise<Task> {

    const docRef = this.collection.doc(id);
    const updateData: Record<string, unknown> = { ...data, updatedAt: new Date() };
    await docRef.update(updateData);
    const doc = await docRef.get();
    return this.mapToEntity(doc);
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }

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