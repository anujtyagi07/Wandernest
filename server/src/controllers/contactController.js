import Contact from '../models/Contact.js';
import AppError from '../utils/AppError.js';
import { sendContactAutoReply, sendInquiryNotification } from '../services/emailService.js';

/**
 * POST /api/v1/contact
 */
export const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const contact = await Contact.create({ name, email, phone: phone || '', subject, message });

    // Send emails (non-blocking)
    sendContactAutoReply(contact).catch(() => {});
    sendInquiryNotification(contact).catch(() => {});

    res.status(201).json({ success: true, message: 'Message sent successfully. We\'ll get back to you soon!' });
  } catch (error) { next(error); }
};
