import { z } from 'zod';
import { AppMessages } from '../../shared/enums/messages.enum';

/**
 * Esquema de validación para la creación de un nuevo usuario.
 */
export const CreateUserSchema = z.object({
  email: z.string({ required_error: AppMessages.EMAIL_REQUERIDO })
    .email(AppMessages.EMAIL_INVALIDO)
    .trim()
    .toLowerCase(),
});

/** DTO para la creación de usuarios. */
export type CreateUserDTO = z.infer<typeof CreateUserSchema>;

/**
 * Esquema de validación para buscar o identificar a un usuario por email.
 */
export const FindUserSchema = CreateUserSchema;

/** DTO para la búsqueda de usuarios. */
export type FindUserDTO = z.infer<typeof FindUserSchema>;

/**
 * Representa la entidad de Usuario en el sistema.
 */
export interface User {
  /** Identificador único generado por Firestore. */
  id: string;
  /** Correo electrónico único del usuario. */
  email: string;
  /** Fecha de registro del usuario. */
  createdAt: Date;
}

/**
 * Respuesta estándar para operaciones de autenticación.
 */
export interface AuthResponse {
  /** Datos del usuario autenticado o null si no existe. */
  user: User | null;
  /** Token JWT generado para la sesión. */
  token?: string;
}

/**
 * Respuesta extendida para la búsqueda de existencia de usuarios.
 */
export interface LookupResponse extends AuthResponse {
  /** Indica si el usuario fue encontrado en la base de datos. */
  exists: boolean;
}