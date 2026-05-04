import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../../shared/errors/app.error';
import { logger } from '../../config/logger';
import { ResponseHelper } from '../../shared/response';
import { AppMessages } from '../../shared/enums/messages.enum';

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