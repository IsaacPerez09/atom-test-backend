import { z } from 'zod';
import { AppMessages } from '../../shared/enums/messages.enum';

export const CreateUserSchema = z.object({
  email: z.string({ required_error: AppMessages.EMAIL_REQUERIDO })
    .email(AppMessages.EMAIL_INVALIDO),
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;

export const FindUserSchema = z.object({
  email: z.string({ required_error: AppMessages.EMAIL_REQUERIDO })
    .email(AppMessages.EMAIL_INVALIDO),
});

export type FindUserDTO = z.infer<typeof FindUserSchema>;

export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export interface AuthResponse {
  user: User | null;
  token?: string;
}

export interface LookupResponse extends AuthResponse {
  exists: boolean;
}