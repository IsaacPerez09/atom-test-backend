import { Firestore, DocumentSnapshot } from '@google-cloud/firestore';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/interfaces/repository.interface';
import { FirestoreRepository } from './base.repository';

/**
 * Implementación de IUserRepository para Cloud Firestore.
 */
export class UserRepository extends FirestoreRepository<User> implements IUserRepository {
  /**
   * @param db Instancia de Firestore.
   */
  constructor(db: Firestore) {
    super(db, 'users');
  }

  /**
   * Busca un usuario por su correo electrónico.
   * @param email Email a buscar.
   * @returns El usuario encontrado o null.
   */
  async findByEmail(email: string): Promise<User | null> {
    const snapshot = await this.db
      .collection(this.collectionName)
      .where('email', '==', email)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    return this.mapToEntity(snapshot.docs[0]);
  }

  /**
   * Crea un nuevo registro de usuario.
   * @param email Email del usuario.
   * @returns Entidad User creada.
   */
  async create(email: string): Promise<User> {
    const userRef = this.collection.doc();
    const user: User = {
      id: userRef.id,
      email,
      createdAt: new Date(),
    };
    await userRef.set(user);
    return user;
  }

  /**
   * Mapea un documento de Firestore a la entidad User.
   * @param doc Snapshot del documento.
   * @returns Entidad User.
   */
  protected mapToEntity(doc: DocumentSnapshot): User {
    const data = doc.data()!;
    return {
      id: doc.id,
      email: data.email,
      createdAt: this.parseDate(data.createdAt),
    };
  }
}