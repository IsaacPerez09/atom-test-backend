import pino from 'pino';
import { envs } from './envs';

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
