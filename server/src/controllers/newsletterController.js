import NewsletterSubscriber from '../models/NewsletterSubscriber.js';
import AppError from '../utils/AppError.js';
import crypto from 'crypto';

/**
 * POST /api/v1/newsletter/subscribe
 */
export const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    const existing = await NewsletterSubscriber.findOne({ email });
    if (existing) {
      if (existing.isSubscribed) {
        return res.json({ success: true, message: 'You are already subscribed!' });
      }
      existing.isSubscribed = true;
      existing.unsubscribedAt = null;
      await existing.save();
      return res.json({ success: true, message: 'Welcome back! You\'ve been resubscribed.' });
    }

    await NewsletterSubscriber.create({ email });
    res.status(201).json({ success: true, message: 'Successfully subscribed to the newsletter!' });
  } catch (error) { next(error); }
};

/**
 * GET /api/v1/newsletter/unsubscribe/:token
 */
export const unsubscribe = async (req, res, next) => {
  try {
    const email = Buffer.from(req.params.token, 'base64').toString('utf-8');
    const sub = await NewsletterSubscriber.findOne({ email });
    if (!sub) return next(AppError.notFound('Subscription not found'));

    sub.isSubscribed = false;
    sub.unsubscribedAt = new Date();
    await sub.save();

    res.json({ success: true, message: 'You have been unsubscribed.' });
  } catch (error) { next(error); }
};
