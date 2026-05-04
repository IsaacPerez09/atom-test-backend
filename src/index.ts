import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { taskRouter } from './presentation/routes/task.routes';
import { userRouter } from './presentation/routes/user.routes';
import { errorHandler } from './presentation/middleware/error.middleware';
import { logger } from './config/logger';
import { envs } from './config/envs';
import { globalLimiter } from './presentation/middleware/rate-limit.middleware';

/**
 * Aplicación principal de Express.
 * Configura middlewares globales, límites de tráfico y rutas del API.
 */
const app = express();

app.set('trust proxy', 1);

app.use(helmet({
  frameguard: {
    action: 'deny',
  },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      frameAncestors: ["'none'"],
    },
  },
}));

app.use(cors({
  origin: envs.ALLOWED_ORIGINS.split(','),
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());

app.use(globalLimiter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/tasks', taskRouter);
app.use('/users', userRouter);

app.use(errorHandler);

export { app };

const PORT = envs.PORT;
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });
}