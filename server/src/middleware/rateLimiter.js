import rateLimit from 'express-rate-limit';

const createRateLimiter = ({ windowMs, max, message }) =>
  rateLimit({
    windowMs,
    max,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
  });

export const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,   // 15 min
  max: 1000,
  message: 'Too many requests, please try again later',
});

export const authLimiter = createRateLimiter({
  windowMs: 60 * 1000,         // 1 min
  max: 5,
  message: 'Too many auth attempts, please wait a moment',
});

export const bookingLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many booking requests, please try again later',
});

export const otpLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 3,
  message: 'Too many OTP requests, please wait a minute',
});
