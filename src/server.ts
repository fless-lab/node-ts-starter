// server.ts

import { initServices } from './helpers';
import config from './config';

initServices().then(() => {
    const app = require('./src/framework/webserver/express').default;
    app.listen(config.port, () => {
        console.log(`Server running on http://localhost:${config.port}`);
    });
}).catch(error => {
    console.error('Failed to initialize services:', error);
});
