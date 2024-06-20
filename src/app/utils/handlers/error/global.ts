import { Response } from 'express';

export const globalErrorHandler = (err: any, res: Response) => {
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  const errorResponse = {
    status: 'error',
    statusCode,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  };

  res.status(statusCode).json(errorResponse);
};
