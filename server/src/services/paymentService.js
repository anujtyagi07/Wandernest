import Razorpay from 'razorpay';
import crypto from 'crypto';
import { env } from '../config/env.js';
import AppError from '../utils/AppError.js';

let razorpayInstance = null;

const getInstance = () => {
  if (!razorpayInstance && env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

/**
 * Create a Razorpay order
 */
export const createOrder = async (amount, currency = 'INR', receipt = '') => {
  const instance = getInstance();
  if (!instance) {
    // Mock mode -- return a fake order ID for development
    console.log('[Payment Mock] Order created:', { amount, currency, receipt });
    return {
      id: `order_mock_${Date.now()}`,
      amount: amount * 100,
      currency,
      receipt,
      status: 'created',
    };
  }

  const order = await instance.orders.create({
    amount: amount * 100, // Razorpay uses paise
    currency,
    receipt: receipt || `receipt_${Date.now()}`,
  });

  return order;
};

/**
 * Verify Razorpay payment signature
 */
export const verifySignature = (orderId, paymentId, signature) => {
  const instance = getInstance();
  if (!instance) {
    console.log('[Payment Mock] Signature verified (mock mode)');
    return true;
  }

  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature !== signature) {
    throw AppError.badRequest('Invalid payment signature');
  }

  return true;
};

/**
 * Process a refund
 */
export const processRefund = async (paymentId, amount) => {
  const instance = getInstance();
  if (!instance) {
    console.log('[Payment Mock] Refund processed:', { paymentId, amount });
    return { id: `refund_mock_${Date.now()}`, status: 'processed' };
  }

  const refund = await instance.payments.refund(paymentId, {
    amount: amount * 100,
  });

  return refund;
};
