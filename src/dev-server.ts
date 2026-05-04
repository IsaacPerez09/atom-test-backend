import { app } from './index';
import { envs } from './config/envs';
import { logger } from './config/logger';

const PORT = envs.PORT;

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});