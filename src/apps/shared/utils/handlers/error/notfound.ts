import { Request, Response, NextFunction } from 'express';
import ErrorResponse from './response';

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(new ErrorResponse('NOT_FOUND_ERROR', 'Resource Not Found'));
};

export default notFoundHandler;
