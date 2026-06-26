import bcrypt from 'bcryptjs';
import Otp from '../models/Otp.js';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import { randomString } from '../utils/helpers.js';
import { OTP_EXPIRY_MINUTES } from '../config/constants.js';

/**
 * Generate and store OTP for phone verification (mock SMS -- logs to console)
 */
export const generateOtp = async (phone) => {
  // Invalidate any existing unused OTPs for this phone
  await Otp.updateMany({ phone, isUsed: false }, { isUsed: true });

  const code = randomString(6);
  const hashedCode = await bcrypt.hash(code, 10);

  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await Otp.create({ phone, code: hashedCode, expiresAt });

  // Mock SMS -- log to console in development
  console.log(`\n  [OTP Mock SMS]`);
  console.log(`  To: ${phone}`);
  console.log(`  Code: ${code}`);
  console.log(`  Expires in: ${OTP_EXPIRY_MINUTES} minutes\n`);

  return { expiresIn: OTP_EXPIRY_MINUTES };
};

/**
 * Verify OTP code for a phone number
 */
export const verifyOtp = async (phone, code) => {
  const otp = await Otp.findOne({ phone, isUsed: false })
    .sort({ createdAt: -1 })
    .limit(1);

  if (!otp) throw AppError.badRequest('No active OTP found. Please request a new one.');
  if (otp.expiresAt < new Date()) throw AppError.badRequest('OTP has expired. Please request a new one.');

  const isValid = await bcrypt.compare(code, otp.code);
  if (!isValid) throw AppError.badRequest('Invalid OTP code');

  // Mark OTP as used
  otp.isUsed = true;
  await otp.save();

  // Update user phone verification status
  const user = await User.findOne({ phone });
  if (user) {
    user.isPhoneVerified = true;
    await user.save({ validateBeforeSave: false });
  }

  return { verified: true };
};
