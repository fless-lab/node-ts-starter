import rateLimit from 'express-rate-limit';
import config from '../../../config';

// TODO: Remove this later and use the one that's in helpers
const msToMinutes = (ms: number): number => {
  return Math.ceil(ms / 60000);
};

export const apiRateLimiter = rateLimit({
  windowMs: config.rate.limit, // Time window in milliseconds
  max: config.rate.max, // Maximum number of requests
  standardHeaders: !config.runningProd, //Show ratelimit headers when not in production
  message: `Too many requests from this IP, please try again after ${msToMinutes(config.rate.limit)} minutes.`,
});
