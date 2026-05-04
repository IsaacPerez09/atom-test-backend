import { Firestore, DocumentSnapshot } from '@google-cloud/firestore';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/interfaces/repository.interface';
import { FirestoreRepository } from './base.repository';

export class UserRepository extends FirestoreRepository<User> implements IUserRepository {
  constructor(db: Firestore) {
    super(db, 'users');
  }

  async findByEmail(email: string): Promise<User | null> {
    const snapshot = await this.db
      .collection(this.collectionName)
      .where('email', '==', email)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    return this.mapToEntity(snapshot.docs[0]);
  }

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

  protected mapToEntity(doc: DocumentSnapshot): User {
    const data = doc.data()!;
    return {
      id: doc.id,
      email: data.email,
      createdAt: this.parseDate(data.createdAt),
    };
  }
}