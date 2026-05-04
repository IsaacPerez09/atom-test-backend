import { Request, Response, NextFunction } from 'express';
import { ResponseHelper } from '../../shared/response';
import jwt from 'jsonwebtoken';
import { envs } from '../../config/envs';
import { logger } from '../../config/logger';
import { AppMessages } from '../../shared/enums/messages.enum';

/**
 * Interfaz de petición extendida que incluye el ID del usuario autenticado.
 */
export interface AuthenticatedRequest extends Request {
  /** ID del usuario extraído del token JWT. */
  userId?: string;
}

/**
 * Middleware para validar el token JWT en las peticiones.
 * Extrae el token de las cookies o del header Authorization, lo verifica e inyecta el userId en la petición.
 * @param req Petición Express extendida.
 * @param res Respuesta Express.
 * @param next Función para continuar al siguiente middleware/controlador.
 */
export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. Intentar obtener el token de las cookies
    let token = req.cookies?.token;

    // 2. Fallback al header Authorization (Para desarrollo o usuarios que no usen cookies)
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.replace('Bearer ', '').trim();
    }

    if (!token) {
      res.status(401).json(ResponseHelper.error('UNAUTHORIZED', AppMessages.FALTA_TOKEN));
      return;
    }

    const decodedToken = jwt.verify(token, envs.JWT_SECRET) as { userId: string };
    logger.debug({ decodedToken }, 'decodedToken');
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    logger.error({ error }, 'Auth Error');
    res.status(401).json(ResponseHelper.error('INVALID_TOKEN', AppMessages.TOKEN_INVALIDO));
  }
};