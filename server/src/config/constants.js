export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  // Cross-origin (separate Railway services use different subdomains):
  // 'none' is required so cookies are sent cross-origin; must pair with secure:true
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  REFUNDED: 'refunded',
};

export const USER_ROLE = {
  USER: 'user',
  ADMIN: 'admin',
};

export const CANCELLATION_POLICY = {
  FREE_DAYS: 7,       // Full refund if cancelled 7+ days before travel
  PARTIAL_DAYS: 3,     // 25% fee if cancelled 3-7 days before travel
  // < 3 days: non-refundable
  PARTIAL_FEE: 0.25,
};

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 12,
  MAX_LIMIT: 50,
};

export const OTP_EXPIRY_MINUTES = 5;

export const RECAPTCHA_THRESHOLD = 0.5;
