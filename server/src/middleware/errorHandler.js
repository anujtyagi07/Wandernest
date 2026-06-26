import AppError from '../utils/AppError.js';
import { env } from '../config/env.js';

/**
 * Global error handler middleware
 */
export const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || null;

  // Mongoose validation error
  if (err.name === 'ValidationError' && err.errors) {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.entries(err.errors).reduce((acc, [key, val]) => {
      acc[key] = val.message;
      return acc;
    }, {});
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Non-operational errors in production
  if (env.NODE_ENV === 'production' && !err.isOperational) {
    statusCode = 500;
    message = 'Something went wrong';
    errors = null;
  }

  const response = { success: false, message };
  if (errors) response.errors = errors;
  if (env.NODE_ENV === 'development') response.stack = err.stack;

  console.error(`[${statusCode}] ${message}`, env.NODE_ENV === 'development' ? err.stack : '');

  res.status(statusCode).json(response);
};
