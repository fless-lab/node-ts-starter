import { Request, Response, NextFunction } from 'express';
import config from '../../../config';

export const clientAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const clientToken = req.headers['x-client-token'] as string;

  if (!clientToken) {
    return res.status(401).send('Unauthorized');
  }

  const [username, password] = Buffer.from(clientToken, 'base64')
    .toString()
    .split(':');

  const validUser = config.basicAuthUser;
  const validPass = config.basicAuthPass;

  if (username === validUser && password === validPass) {
    return next();
  } else {
    return res.status(403).send('Forbidden');
  }
};
