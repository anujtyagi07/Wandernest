import cron from 'node-cron';
import Booking from '../models/Booking.js';
import Otp from '../models/Otp.js';
import { BOOKING_STATUS } from '../config/constants.js';

/**
 * Setup cron jobs for scheduled tasks
 */
export const setupCronJobs = () => {
  // Clean up expired/used OTPs every hour (backup for MongoDB TTL)
  cron.schedule('0 * * * *', async () => {
    try {
      const result = await Otp.deleteMany({
        $or: [
          { expiresAt: { $lt: new Date() } },
          { isUsed: true, createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
        ],
      });
      if (result.deletedCount > 0) {
        console.log(`[Cron] Cleaned ${result.deletedCount} expired/used OTPs`);
      }
    } catch (err) {
      console.error('[Cron] OTP cleanup error:', err.message);
    }
  });

  // Auto-complete bookings whose travel date has passed (daily at 1 AM)
  cron.schedule('0 1 * * *', async () => {
    try {
      const result = await Booking.updateMany(
        {
          status: BOOKING_STATUS.CONFIRMED,
          travelDate: { $lt: new Date() },
        },
        {
          status: BOOKING_STATUS.COMPLETED,
          completedAt: new Date(),
        }
      );
      if (result.modifiedCount > 0) {
        console.log(`[Cron] Auto-completed ${result.modifiedCount} past bookings`);
      }
    } catch (err) {
      console.error('[Cron] Booking auto-complete error:', err.message);
    }
  });

  console.log('[Cron] Scheduled jobs initialized');
};
