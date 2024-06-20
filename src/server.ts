import { initServices } from './helpers';
import config from './config';

async function startServer() {
  try {
    await initServices();
    const { default: app } = await import('./framework/webserver/express');
    app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('Failed to initialize services:', error);
  }
}

startServer();
