import { initServices } from './helpers';
import config from './config';
import { WebServer } from './framework';
import { logger } from './apps';

async function startServer() {
  try {
    await initServices();
    const app = WebServer.app;
    app.listen(config.port, () => {
      logger.info(`Server running on http://localhost:${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to initialize services', error as any);
  }
}

startServer();
