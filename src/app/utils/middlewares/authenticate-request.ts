import { Request, Response, NextFunction } from 'express';
import jwtService from '../../services/shared/jwt.service';

const authenticateRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  jwtService.verifyAccessToken(req, res, next);
};

export default authenticateRequest;
