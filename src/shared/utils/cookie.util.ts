import { Response } from 'express';
import { envs } from '../../config/envs';

/**
 * Configura una cookie segura con el token JWT.
 * @param res Respuesta Express.
 * @param token Token JWT a almacenar.
 */
export const setAuthCookie = (res: Response, token: string): void => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: envs.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 1 día (24 horas)
  });
};

/**
 * Elimina la cookie de autenticación (logout).
 * @param res Respuesta Express.
 */
export const clearAuthCookie = (res: Response): void => {
  res.clearCookie('token');
};
