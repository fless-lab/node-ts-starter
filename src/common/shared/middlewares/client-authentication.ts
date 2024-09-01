import { Request, Response, NextFunction } from 'express';
import { logger } from '../services';
import { config } from '../../../core/config';

export const clientAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const clientToken = req.headers['x-client-token'] as string;

  if (!clientToken) {
    logger.warn(
      `Unauthorized access attempt from IP: ${req.ip} - No client token provided`,
    );
    return res.status(401).send('Unauthorized');
  }

  const [username, password] = Buffer.from(clientToken, 'base64')
    .toString()
    .split(':');

  const validUser = config.basicAuthUser;
  const validPass = config.basicAuthPass;

  if (username === validUser && password === validPass) {
    logger.info(`Client authenticated successfully from IP: ${req.ip}`);
    return next();
  } else {
    logger.warn(
      `Forbidden access attempt from IP: ${req.ip} - Invalid credentials`,
    );
    return res.status(403).send('Forbidden');
  }
};
