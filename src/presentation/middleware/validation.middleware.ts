import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ResponseHelper } from '../../shared/response';

/**
 * Factory de middleware para validar el cuerpo (body) de una petición usando un esquema Zod.
 * @param schema Esquema de validación Zod.
 * @returns Middleware de Express.
 */
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        res.status(400).json(ResponseHelper.error('VALIDATION_ERROR', message));
        return;
      }
      next(error);
    }
  };
};

/**
 * Factory de middleware para validar los parámetros de consulta (query) usando un esquema Zod.
 * @param schema Esquema de validación Zod.
 * @returns Middleware de Express.
 */
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        res.status(400).json(ResponseHelper.error('VALIDATION_ERROR', message));
        return;
      }
      next(error);
    }
  };
};