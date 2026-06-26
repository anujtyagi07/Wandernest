import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import { env } from '../config/env.js';

/**
 * Protect route -- require valid JWT
 */
export const protect = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return next(AppError.unauthorized('Access token required'));
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-passwordHash -refreshToken');
    if (!user) return next(AppError.unauthorized('User no longer exists'));

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(AppError.unauthorized('Invalid or expired token'));
    }
    next(error);
  }
};

/**
 * Admin only -- require admin role
 */
export const adminOnly = (req, _res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(AppError.forbidden('Admin access required'));
  }
  next();
};

/**
 * Optional auth -- attach user if token present, continue if not
 */
export const optionalAuth = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer ')) {
      const token = header.split(' ')[1];
      const decoded = jwt.verify(token, env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-passwordHash -refreshToken');
      if (user) req.user = user;
    }
    next();
  } catch {
    next();
  }
};
