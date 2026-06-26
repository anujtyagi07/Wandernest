import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import { generateTokens, verifyRefreshToken } from '../utils/tokenGenerator.js';
import { generateOtp, verifyOtp } from '../services/otpService.js';
import { sendPasswordReset } from '../services/emailService.js';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import crypto from 'crypto';

/**
 * POST /api/v1/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return next(AppError.conflict('Email already registered'));

    const user = new User({ name, email, passwordHash: password, phone: phone || '' });
    await user.save();

    const tokens = await generateTokens(user);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: user.toJSON(),
      ...tokens,
    });
  } catch (error) { next(error); }
};

/**
 * POST /api/v1/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) return next(AppError.unauthorized('Invalid email or password'));

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return next(AppError.unauthorized('Invalid email or password'));

    const tokens = await generateTokens(user);

    res.json({
      success: true,
      message: 'Login successful',
      user: user.toJSON(),
      ...tokens,
    });
  } catch (error) { next(error); }
};

/**
 * POST /api/v1/auth/logout
 */
export const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) { next(error); }
};

/**
 * POST /api/v1/auth/refresh
 */
export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return next(AppError.badRequest('Refresh token required'));

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      return next(AppError.unauthorized('Invalid refresh token'));
    }

    const tokens = await generateTokens(user);

    res.json({ success: true, ...tokens });
  } catch (error) { next(error); }
};

/**
 * POST /api/v1/auth/forgot-password
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ success: true, message: 'If the email exists, a reset link has been sent' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.refreshToken = resetToken; // Reuse field for reset token storage
    await user.save({ validateBeforeSave: false });

    await sendPasswordReset(user, resetToken);

    res.json({ success: true, message: 'If the email exists, a reset link has been sent' });
  } catch (error) { next(error); }
};

/**
 * POST /api/v1/auth/reset-password/:token
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ refreshToken: token }).select('+passwordHash');
    if (!user) return next(AppError.badRequest('Invalid or expired reset token'));

    user.passwordHash = password;
    user.refreshToken = null;
    await user.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) { next(error); }
};

/**
 * GET /api/v1/auth/profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) { next(error); }
};

/**
 * PUT /api/v1/auth/profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });

    res.json({ success: true, message: 'Profile updated', user });
  } catch (error) { next(error); }
};

/**
 * POST /api/v1/auth/change-password
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+passwordHash');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return next(AppError.badRequest('Current password is incorrect'));

    user.passwordHash = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) { next(error); }
};

/**
 * POST /api/v1/auth/generate-otp
 */
export const generateOtpHandler = async (req, res, next) => {
  try {
    const { phone } = req.body;

    // Update user's phone number
    await User.findByIdAndUpdate(req.user._id, { phone });

    const result = await generateOtp(phone);

    res.json({ success: true, message: 'OTP sent successfully', expiresIn: result.expiresIn });
  } catch (error) { next(error); }
};

/**
 * POST /api/v1/auth/verify-otp
 */
export const verifyOtpHandler = async (req, res, next) => {
  try {
    const { phone, code } = req.body;
    const result = await verifyOtp(phone, code);

    res.json({ success: true, message: 'Phone verified successfully', ...result });
  } catch (error) { next(error); }
};
