import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { taskRouter } from './presentation/routes/task.routes';
import { userRouter } from './presentation/routes/user.routes';
import { errorHandler } from './presentation/middleware/error.middleware';
import { logger } from './config/logger';
import { envs } from './config/envs';
import { globalLimiter } from './presentation/middleware/rate-limit.middleware';

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({
  origin: envs.ALLOWED_ORIGINS.split(','),
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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