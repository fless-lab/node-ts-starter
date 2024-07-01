/* eslint-disable @typescript-eslint/no-inferrable-types */
import ErrorCodes, { ErrorCode } from './codes';

class ErrorResponse extends Error {
  public statusCode: number;
  public code: string;
  public suggestions: string[];
  public originalError?: Error;

  constructor(
    code: string,
    message?: string,
    suggestions: string[] = [],
    originalError?: Error,
  ) {
    const errorCode: ErrorCode = ErrorCodes[code] || ErrorCodes.GENERAL_ERROR;
    super(message || errorCode.message);
    this.code = errorCode.code;
    this.statusCode = errorCode.statusCode;
    this.suggestions = suggestions;
    this.originalError = originalError;

    // Capture the stack trace of the original error if provided
    if (originalError) {
      this.stack = originalError.stack;
    }
  }
}

export default ErrorResponse;
