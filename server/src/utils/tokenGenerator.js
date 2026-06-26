import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Generate access token
 */
export const generateAccessToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRE }
  );

/**
 * Generate refresh token
 */
export const generateRefreshToken = (user) =>
  jwt.sign(
    { id: user._id },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRE }
  );

/**
 * Verify access token
 */
export const verifyAccessToken = (token) =>
  jwt.verify(token, env.JWT_SECRET);

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token) =>
  jwt.verify(token, env.JWT_REFRESH_SECRET);

/**
 * Generate both tokens and optionally persist refresh token
 */
export const generateTokens = async (user, saveRefresh = true) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  if (saveRefresh) {
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
  }

  return { accessToken, refreshToken };
};
