/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from '../../app/routes/routes';
import notFoundHandler from '../../app/utils/handlers/error/notfound';
import errorHandler from '../../app/utils/handlers/error/global';
import config from '../../config';
import { clientAuthentication } from '../../app/utils/middlewares';
import bruteForce from '../../app/utils/middlewares/bruteforce';
import initializeViewEngine from '../view-engine';
import { initializeSessionAndFlash } from '../session-flash';

const app = express();
const morganEnv = config.runningProd ? 'combined' : 'dev';

// Express configuration
app.use(cors());
app.use(helmet()); // Use Helmet to add various security headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://www.google-analytics.com',
      ],
      imgSrc: [
        "'self'",
        'data:',
        'https://www.google-analytics.com',
        'https://image.flaticon.com',
        'https://images.unsplash.com',
      ],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    },
  }),
);
app.use(helmet.frameguard({ action: 'deny' })); // Prevent the app from being displayed in an iframe
app.use(helmet.xssFilter()); // Protect against XSS attacks
app.use(helmet.noSniff()); // Prevent MIME type sniffing
app.use(helmet.ieNoOpen()); // Prevent IE from executing downloads
app.use(morgan(morganEnv));
app.use(express.json());
app.disable('x-powered-by'); // Disable X-Powered-By header

// Initialize Session and Flash
initializeSessionAndFlash(app);

// Set view engine
initializeViewEngine(app);

// Apply brute force protection to login route
// app.post('/api/auth/login', bruteForce.prevent, (req, res) => {
//   res.send('Login route');
// });

// Client authentication middleware
app.use(clientAuthentication);

// Serve routes
// app.get('/', routes);

// API Routes
app.use('/api/v1', routes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
