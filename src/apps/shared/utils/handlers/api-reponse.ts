/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-inferrable-types */

import { Response } from 'express';
import { ErrorResponseType, SuccessResponseType } from '../../types';

export class ApiResponse {
  static success<T>(
    res: Response,
    data: SuccessResponseType<T>,
    statusCode: number = 200,
  ): Response {
    return res.status(statusCode).json(data);
  }

  static error(res: Response, error: ErrorResponseType): Response {
    const {
      error: { code, message, suggestions, statusCode },
    } = error;
    return res.status(statusCode).json({
      success: false,
      error: { status: statusCode, message, suggestions },
    });
  }
}

export default ApiResponse;
