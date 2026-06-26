import { env } from '../config/env.js';

/**
 * Verify reCAPTCHA v3 token with Google
 */
export const verifyRecaptcha = async (token) => {
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${env.RECAPTCHA_SECRET}&response=${token}`;

  const response = await fetch(url, { method: 'POST' });
  const data = await response.json();

  return {
    success: data.success || false,
    score: data.score || 0,
    action: data.action || '',
    hostname: data.hostname || '',
  };
};
