import AppError from '../utils/AppError.js';
import { verifyRecaptcha } from '../services/captchaService.js';
import { env } from '../config/env.js';

/**
 * Verify Google reCAPTCHA v3 token
 */
export const verifyCaptcha = async (req, _res, next) => {
  try {
    // Skip captcha in development if no secret configured
    if (env.NODE_ENV === 'development' && !env.RECAPTCHA_SECRET) {
      return next();
    }

    const token = req.body.recaptchaToken;
    if (!token) {
      return next(AppError.badRequest('reCAPTCHA token is required'));
    }

    const result = await verifyRecaptcha(token);
    if (!result.success || result.score < 0.5) {
      return next(AppError.badRequest('reCAPTCHA verification failed. Please try again.'));
    }

    next();
  } catch (error) {
    // Fail open in development -- don't block if reCAPTCHA service is down
    if (env.NODE_ENV === 'development') return next();
    next(AppError.badRequest('reCAPTCHA verification error'));
  }
};
