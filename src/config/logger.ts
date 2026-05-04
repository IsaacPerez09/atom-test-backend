import pino from 'pino';
import { envs } from './envs';

/**
 * Instancia de logger configurada con Pino.
 * En desarrollo utiliza 'pino-pretty' para una mejor legibilidad.
 * En producción emite logs estructurados en formato JSON.
 */
export const logger = pino({
  level: envs.NODE_ENV === 'development' ? 'debug' : 'info',
  transport:
    envs.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
});
