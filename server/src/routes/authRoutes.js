import { Router } from 'express';
import * as auth from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { verifyCaptcha } from '../middleware/captcha.js';
import { authLimiter, otpLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import {
  registerSchema, loginSchema, forgotPasswordSchema,
  resetPasswordSchema, changePasswordSchema, updateProfileSchema,
  generateOtpSchema, verifyOtpSchema,
} from '../validators/authValidator.js';

const router = Router();

router.post('/register', authLimiter, verifyCaptcha, validate(registerSchema), auth.register);
router.post('/login', authLimiter, verifyCaptcha, validate(loginSchema), auth.login);
router.post('/logout', protect, auth.logout);
router.post('/refresh', auth.refresh);
router.post('/forgot-password', authLimiter, verifyCaptcha, validate(forgotPasswordSchema), auth.forgotPassword);
router.post('/reset-password/:token', validate(resetPasswordSchema), auth.resetPassword);
router.get('/profile', protect, auth.getProfile);
router.put('/profile', protect, validate(updateProfileSchema), auth.updateProfile);
router.post('/change-password', protect, validate(changePasswordSchema), auth.changePassword);
router.post('/generate-otp', protect, otpLimiter, validate(generateOtpSchema), auth.generateOtpHandler);
router.post('/verify-otp', validate(verifyOtpSchema), auth.verifyOtpHandler);

export default router;
