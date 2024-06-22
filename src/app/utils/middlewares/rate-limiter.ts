import rateLimit from 'express-rate-limit';
import config from '../../../config';
import { msToMinutes } from '../../../helpers/time';

export const apiLimiter = rateLimit({
  windowMs: config.rate.limit, // Time window in milliseconds
  max: config.rate.max, // Maximum number of requests
  message: `Too many requests from this IP, please try again after ${msToMinutes(config.rate.limit)} minutes.`,
});
