import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../../shared/errors/app.error';
import { logger } from '../../config/logger';
import { ResponseHelper } from '../../shared/response';
import { AppMessages } from '../../shared/enums/messages.enum';

/**
 * Manejador global de errores para la aplicación Express.
 * Captura AppErrors personalizados, errores de validación Zod y errores inesperados.
 * @param err Error capturado.
 * @param req Petición Express.
 * @param res Respuesta Express.
 * @param next Función next de Express.
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json(ResponseHelper.error(err.constructor.name, err.message));
    return;
  }

  if (err instanceof ZodError) {
    const message = err.errors.map(e => e.message).join(', ');
    res.status(400).json(ResponseHelper.error('ValidationError', message));
    return;
  }

  logger.error({ err }, 'Unhandled Error');
  res.status(500).json(ResponseHelper.error('INTERNAL_SERVER_ERROR', AppMessages.ERROR_INTERNO));
};