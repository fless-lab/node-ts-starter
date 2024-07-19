import { RateLimiterMongo } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';
import config from '../../../config';
import { DB } from '../../../framework';

let bruteForceLimiter: RateLimiterMongo | undefined;

const setupRateLimiter = async (): Promise<void> => {
  try {
    await DB.mongo.init(config.db.uri, config.db.name);
    const mongoConn = await DB.mongo.getClient();

    bruteForceLimiter = new RateLimiterMongo({
      storeClient: mongoConn,
      points: config.bruteForce.freeRetries, // Nombre de tentatives autorisées
      duration: Math.ceil(config.bruteForce.lifetime / 1000), // Durée de vie en secondes
      blockDuration: Math.ceil(config.bruteForce.maxWait / 1000), // Durée de blocage en secondes
    });

    console.log('Rate limiter configured.');
  } catch (error) {
    console.error('Error setting up rate limiter:', error);
  }
};

setupRateLimiter();

const bruteForceMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!bruteForceLimiter) {
    res.status(500).json({
      message: 'Rate limiter not configured yet. Please try again later.',
    });
    return;
  }

  try {
    await bruteForceLimiter.consume(req.ip as string);
    next();
  } catch (rejRes: any) {
    const retrySecs = Math.ceil(rejRes.msBeforeNext / 1000) || 1;
    !config.runningProd && res.set('Retry-After', String(retrySecs)); //Send Retry-After only in dev mode
    res.status(429).json({
      message: `Too many attempts, please try again after ${Math.ceil(rejRes.msBeforeNext / 60000)} minutes.`,
    });
  }
};

export default bruteForceMiddleware;
