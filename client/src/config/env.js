export const env = {
  // API
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',

  // Derived — socket base URL (strip the /api/v1 path)
  SOCKET_URL: import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000',

  // Google reCAPTCHA v3
  RECAPTCHA_SITE_KEY: import.meta.env.VITE_RECAPTCHA_SITE_KEY || '',
};
