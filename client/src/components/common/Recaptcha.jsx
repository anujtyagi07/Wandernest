import { useCallback, useEffect, useRef } from 'react';

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';

/**
 * reCAPTCHA v3 hook for form protection
 * Returns a function that executes reCAPTCHA and returns the token
 * Falls back to a mock token in development when site key is not configured
 */
export const useRecaptcha = (action = 'submit') => {
  const executeRecaptcha = useCallback(async () => {
    // Development fallback — return mock token if no site key configured
    if (!RECAPTCHA_SITE_KEY) {
      return 'dev-mock-recaptcha-token';
    }

    // Check if grecaptcha is loaded
    if (typeof window === 'undefined' || !window.grecaptcha) {
      console.warn('reCAPTCHA not loaded');
      return 'dev-mock-recaptcha-token';
    }

    try {
      const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
      return token;
    } catch (err) {
      console.error('reCAPTCHA execution failed:', err);
      return 'dev-mock-recaptcha-token';
    }
  }, [action]);

  return executeRecaptcha;
};

/**
 * RecaptchaLoader component — loads the reCAPTCHA script
 * Place this once in your App or layout component
 */
export const RecaptchaLoader = () => {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !RECAPTCHA_SITE_KEY) return;

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    loaded.current = true;

    return () => {
      // Cleanup on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null;
};

export default useRecaptcha;
