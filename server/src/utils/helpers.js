/**
 * Generate a random string of specified length
 */
export const randomString = (length = 6) => {
  const chars = '0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Slugify a string for URL-safe usage
 */
export const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * Format currency in INR
 */
export const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

/**
 * Parse pagination query params
 */
export const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit) || 12));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Build paginated response
 */
export const paginatedResponse = (data, total, page, limit) => ({
  data,
  pagination: {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  },
});

/**
 * Calculate cancellation refund percentage based on days until travel
 */
export const calculateRefundPercentage = (travelDate) => {
  const now = new Date();
  const travel = new Date(travelDate);
  const daysUntil = Math.ceil((travel - now) / (1000 * 60 * 60 * 24));

  if (daysUntil >= 7) return 1.0;    // 100% refund
  if (daysUntil >= 3) return 0.75;    // 75% refund (25% fee)
  return 0;                             // No refund
};
