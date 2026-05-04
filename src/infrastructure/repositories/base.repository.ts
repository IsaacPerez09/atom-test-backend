import { Firestore, DocumentSnapshot } from '@google-cloud/firestore';

export abstract class FirestoreRepository<T> {
  protected constructor(
    protected readonly db: Firestore,
    protected readonly collectionName: string
  ) {}

  protected get collection() {
    return this.db.collection(this.collectionName);
  }

  protected parseDate(dateData: any): Date {
    if (!dateData) return new Date();
    if (typeof dateData.toDate === 'function') {
      return dateData.toDate();
    }
    if (dateData.seconds) {
      return new Date(dateData.seconds * 1000);
    }
    return new Date(dateData);
  }

  protected abstract mapToEntity(doc: DocumentSnapshot): T;
}
