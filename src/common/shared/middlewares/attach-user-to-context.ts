import { Request, Response, NextFunction } from 'express';
import { AsyncStorageService, logger } from '../services';

export const attachUserToContext = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const asyncStorage = AsyncStorageService.getInstance();
  // @ts-ignore: Suppress TS error for non-existent property
  const payload = req.payload;
  if (payload && typeof payload.aud === 'string') {
    const userId = payload.aud;

    asyncStorage.run(() => {
      asyncStorage.set('currentUserId', userId);
      next();
    });
  } else {
    logger.warn(
      'Warning: Unable to attach user context, missing payload or audience field.',
    );
    next();
  }
};
