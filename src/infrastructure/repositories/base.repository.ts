import { Firestore, DocumentSnapshot } from '@google-cloud/firestore';

/**
 * Clase base abstracta para repositorios de Firestore.
 * Proporciona utilidades comunes para el manejo de colecciones y fechas.
 * @template T Tipo de la entidad que maneja el repositorio.
 */
export abstract class FirestoreRepository<T> {
  /**
   * @param db Instancia de Firestore (Admin SDK).
   * @param collectionName Nombre de la colección en la base de datos.
   */
  protected constructor(
    protected readonly db: Firestore,
    protected readonly collectionName: string
  ) {}

  /**
   * Obtiene la referencia a la colección de Firestore.
   */
  protected get collection() {
    return this.db.collection(this.collectionName);
  }

  /**
   * Convierte diferentes formatos de fecha de Firestore (Timestamps) a objetos Date de JS.
   * @param dateData Datos de fecha provenientes de Firestore.
   * @returns Objeto Date de JavaScript.
   */
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

  /**
   * Método abstracto para mapear un documento de Firestore a una entidad de dominio.
   * @param doc Snapshot del documento de Firestore.
   * @returns Entidad de dominio de tipo T.
   */
  protected abstract mapToEntity(doc: DocumentSnapshot): T;
}
