import rateLimit from 'express-rate-limit';

// General API rate limiter - 100 requests per 15 minutes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Strict limiter for auth endpoints - 5 requests per 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: 'Too many authentication attempts, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Create account limiter - 3 requests per hour
export const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    error: 'Too many accounts created from this IP, please try again after an hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Chat limiter - 50 messages per minute
export const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50,
  message: {
    error: 'Too many messages sent, please slow down',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
