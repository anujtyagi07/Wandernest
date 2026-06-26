import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: false,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
});

const FROM = `"WanderNest" <${env.SMTP_USER || 'noreply@wandernest.in'}>`;

/**
 * Send booking confirmation email
 */
export const sendBookingConfirmation = async (booking, user) => {
  if (!env.SMTP_USER) {
    console.log('[Email Mock] Booking confirmation for:', user.email);
    return;
  }

  await transporter.sendMail({
    from: FROM,
    to: booking.traveler.email,
    subject: `Booking Confirmed - ${booking._id}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #FF6B35;">WanderNest Booking Confirmation</h1>
        <p>Hi ${booking.traveler.name},</p>
        <p>Your booking has been confirmed!</p>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Booking ID:</strong> ${booking._id}</p>
          <p><strong>Travel Date:</strong> ${new Date(booking.travelDate).toLocaleDateString('en-IN')}</p>
          <p><strong>Guests:</strong> ${booking.adults} Adults${booking.children ? `, ${booking.children} Children` : ''}</p>
          <p><strong>Total Amount:</strong> ₹${booking.totalAmount.toLocaleString('en-IN')}</p>
          <p><strong>Status:</strong> ${booking.status.toUpperCase()}</p>
        </div>
        <p>We're excited to have you on board! Our team will reach out with further details soon.</p>
        <p>Safe travels,<br/>The WanderNest Team</p>
      </div>
    `,
  });
};

/**
 * Send password reset email
 */
export const sendPasswordReset = async (user, token) => {
  const resetUrl = `${env.CLIENT_URL}/auth?reset=${token}`;

  if (!env.SMTP_USER) {
    console.log('[Email Mock] Password reset for:', user.email, 'Token:', token);
    return;
  }

  await transporter.sendMail({
    from: FROM,
    to: user.email,
    subject: 'Password Reset - WanderNest',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #FF6B35;">Reset Your Password</h1>
        <p>Hi ${user.name},</p>
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <a href="${resetUrl}" style="display: inline-block; background: #FF6B35; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">Reset Password</a>
        <p>This link expires in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  });
};

/**
 * Send contact form auto-reply
 */
export const sendContactAutoReply = async (contact) => {
  if (!env.SMTP_USER) {
    console.log('[Email Mock] Contact auto-reply for:', contact.email);
    return;
  }

  await transporter.sendMail({
    from: FROM,
    to: contact.email,
    subject: 'We received your message - WanderNest',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #FF6B35;">Thank You, ${contact.name}!</h1>
        <p>We've received your message regarding "<strong>${contact.subject}</strong>".</p>
        <p>Our team will get back to you within 24 hours.</p>
        <p>In the meantime, feel free to browse our travel packages!</p>
        <a href="${env.CLIENT_URL}/packages" style="display: inline-block; background: #FF6B35; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">Explore Packages</a>
      </div>
    `,
  });
};

/**
 * Notify admin of new inquiry
 */
export const sendInquiryNotification = async (contact) => {
  if (!env.SMTP_USER) {
    console.log('[Email Mock] Admin notification for inquiry:', contact.subject);
    return;
  }

  await transporter.sendMail({
    from: FROM,
    to: 'admin@wandernest.in',
    subject: `New Inquiry: ${contact.subject}`,
    html: `
      <div style="font-family: sans-serif;">
        <h2>New Contact Inquiry</h2>
        <p><strong>From:</strong> ${contact.name} (${contact.email})</p>
        <p><strong>Subject:</strong> ${contact.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${contact.message}</p>
      </div>
    `,
  });
};
