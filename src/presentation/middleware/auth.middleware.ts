import { Request, Response, NextFunction } from 'express';
import { ResponseHelper } from '../../shared/response';
import jwt from 'jsonwebtoken';
import { envs } from '../../config/envs';
import { logger } from '../../config/logger';
import { AppMessages } from '../../shared/enums/messages.enum';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json(ResponseHelper.error('UNAUTHORIZED', AppMessages.FALTA_AUTH_HEADER));
      return;
    }

    const token = authHeader.replace('Bearer ', '').trim();

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