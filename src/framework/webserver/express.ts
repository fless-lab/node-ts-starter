import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { clientAuthentication } from '../../app/utils/middlewares';
import config from '../../config';
import { globalErrorHandler } from '../../app/utils/handlers/error';
import createError from 'http-errors';

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

if (config.enableClientAuth) {
  app.use(clientAuthentication);
}

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use((req, res, next) => {
  next(createError(404, 'Resource Not Found'));
});

app.use(globalErrorHandler);

export default app;
