/* eslint-disable @typescript-eslint/no-unused-vars */

import { Request, Response, NextFunction } from 'express';
import ErrorResponse from './response';
import ApiResponse from '../api-reponse';

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ErrorResponse) {
    return ApiResponse.error(res, { success: false, error: err });
  }

  const genericError = new ErrorResponse(
    'GENERAL_ERROR',
    err.message || 'An unexpected error occurred',
    [],
  );

  return ApiResponse.error(res, {
    success: false,
    error: genericError,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  } as any);
};

export default errorHandler;
