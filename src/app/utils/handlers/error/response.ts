/* eslint-disable @typescript-eslint/no-inferrable-types */
import ErrorCodes, { ErrorCode } from './codes';

class ErrorResponse extends Error {
  public statusCode: number;
  public code: string;
  public suggestions: string[];

  constructor(code: string, message?: string, suggestions: string[] = []) {
    const errorCode: ErrorCode = ErrorCodes[code] || ErrorCodes.GENERAL_ERROR;
    super(message || errorCode.message);
    this.code = errorCode.code;
    this.statusCode = errorCode.statusCode;
    this.suggestions = suggestions;
  }
}

export default ErrorResponse;
