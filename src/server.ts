import { initServices } from './helpers';
import config from './config';
import { WebServer } from './framework';

async function startServer() {
  try {
    await initServices();
    const app = WebServer.app;
    app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('Failed to initialize services:', error);
  }
}

startServer();
