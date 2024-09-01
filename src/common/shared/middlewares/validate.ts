import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { ApiResponse, ErrorResponse } from '../utils';

export const validate = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const { details } = error;
      const message = details.map((i) => i.message).join(',');
      const errorResponse = new ErrorResponse('VALIDATION_ERROR', message);
      return ApiResponse.error(res, {
        success: false,
        error: {
          message: errorResponse.message,
          suggestions: errorResponse.suggestions,
          statusCode: errorResponse.statusCode,
        } as any,
      });
    } else {
      next();
    }
  };
};
