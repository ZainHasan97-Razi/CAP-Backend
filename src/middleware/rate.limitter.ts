import { rateLimit } from 'express-rate-limit'

export const appRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
//   max: (process.env.API_RATE_LIMITING_APP ? process.env.API_RATE_LIMITING_APP : 60),
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
      status: 429,
      message: "Too many requests. Please try again later.",
  },
});