import { z } from 'zod';
import { AppMessages } from '../../shared/enums/messages.enum';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  completed?: boolean;
}

export const CreateTaskSchema = z.object({
  title: z.string({ required_error: AppMessages.TITULO_REQUERIDO })
    .min(1, AppMessages.TITULO_MUY_CORTO)
    .max(200, AppMessages.TITULO_MUY_LARGO),
  description: z.string()
    .max(2000, AppMessages.DESCRIPCION_MUY_LARGA)
    .default(''),
});

export const UpdateTaskSchema = z.object({
  title: z.string()
    .min(1, AppMessages.TITULO_MUY_CORTO)
    .max(200, AppMessages.TITULO_MUY_LARGO)
    .optional(),
  description: z.string()
    .max(2000, AppMessages.DESCRIPCION_MUY_LARGA)
    .optional(),
  completed: z.boolean().optional(),
});