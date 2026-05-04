import { z } from 'zod';
import { AppMessages } from '../../shared/enums/messages.enum';

/**
 * Representa una tarea o pendiente en el sistema.
 */
export interface Task {
  /** Identificador único generado por Firestore. */
  id: string;
  /** ID del usuario propietario de la tarea. */
  userId: string;
  /** Título breve de la tarea. */
  title: string;
  /** Detalles adicionales o cuerpo de la tarea. */
  description: string;
  /** Estado de cumplimiento de la tarea. */
  completed: boolean;
  /** Fecha de creación de la tarea. */
  createdAt: Date;
  /** Fecha de la última actualización de la tarea. */
  updatedAt: Date;
}

/** DTO para la creación de una nueva tarea. */
export interface CreateTaskDTO {
  title: string;
  description: string;
}

/** DTO para la actualización parcial de una tarea existente. */
export interface UpdateTaskDTO extends Partial<CreateTaskDTO> {
  completed?: boolean;
}

/**
 * Esquema base con las validaciones comunes de una tarea.
 */
const TaskBaseSchema = z.object({
  title: z.string({ required_error: AppMessages.TITULO_REQUERIDO })
    .min(1, AppMessages.TITULO_MUY_CORTO)
    .max(200, AppMessages.TITULO_MUY_LARGO),
  description: z.string()
    .max(2000, AppMessages.DESCRIPCION_MUY_LARGA)
    .default(''),
});

/**
 * Esquema de validación para la creación de tareas.
 */
export const CreateTaskSchema = TaskBaseSchema;

/**
 * Esquema de validación para la actualización de tareas.
 * Usa .partial() para que todos los campos sean opcionales.
 */
export const UpdateTaskSchema = TaskBaseSchema.partial().extend({
  completed: z.boolean().optional(),
});