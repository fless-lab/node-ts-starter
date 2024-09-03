import { JwtPayload } from 'jsonwebtoken';

declare module 'express-serve-static-core' {
  interface Request {
    payload?: JwtPayload;
    mongooseOptions?: Record<string, any>;
  }
}
