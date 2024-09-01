import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../services';

const authenticateRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  JwtService.verifyAccessToken(req, res, next);
};

export default authenticateRequest;
