import { ZodError } from 'zod';
import AppError from '../utils/AppError.js';

/**
 * Validate request body/query/params against a Zod schema
 * @param {import('zod').ZodSchema} schema
 * @param {'body'|'query'|'params'} source
 */
export const validate = (schema, source = 'body') => {
  return (req, _res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors = error.errors.reduce((acc, e) => {
          acc[e.path.join('.')] = e.message;
          return acc;
        }, {});
        return next(AppError.badRequest('Validation failed', fieldErrors));
      }
      next(error);
    }
  };
};
