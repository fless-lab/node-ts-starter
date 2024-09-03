import { Request, Response, NextFunction } from 'express';
import { JwtService, AsyncStorageService, logger } from '../services';

export const authenticateAndAttachUserContext = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  JwtService.verifyAccessToken(req, res, (authErr: any) => {
    if (authErr) {
      return next(authErr);
    }

    // @ts-ignore: Suppress TS error for non-existent property
    const payload = req.payload;

    if (payload && typeof payload.aud === 'string') {
      const userId = payload.aud;
      const asyncStorage = AsyncStorageService.getInstance();

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
  });
};
