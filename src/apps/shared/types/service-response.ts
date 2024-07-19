import { ErrorResponse } from '../utils';

export type SuccessResponseType<T> = {
  success: boolean;
  document?: T;
  documents?: T[];
  total?: number;
  results?: number;
  page?: number;
  limit?: number;
  _results?: number;
  error?: ErrorResponse;
};

export type ErrorResponseType = {
  success: boolean;
  error: ErrorResponse;
};
