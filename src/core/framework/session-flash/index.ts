import { Application } from 'express';
import session from 'express-session';
import flash from 'connect-flash';
import { config } from '../../config';

export const initializeSessionAndFlash = (app: Application): void => {
  app.use(
    session({
      secret: config.session.secret,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: config.runningProd },
    }),
  );
  app.use(flash());
};
