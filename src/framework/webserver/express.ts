import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
// import routes from '../../app/routes';

// Create Express server
const app = express();

// Express configuration
app.use(cors()); // Enable CORS
app.use(helmet()); // Enable Helmet
app.use(morgan('dev')); // Enable Morgan

// Define routes
// app.use('/', routes); 

export default app;
