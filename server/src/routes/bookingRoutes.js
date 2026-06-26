import { Router } from 'express';
import * as booking from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';
import { verifyCaptcha } from '../middleware/captcha.js';
import { bookingLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import { createBookingSchema } from '../validators/bookingValidator.js';

const router = Router();

router.post('/', protect, bookingLimiter, verifyCaptcha, validate(createBookingSchema), booking.createBooking);
router.post('/:id/confirm-payment', protect, booking.confirmPayment);
router.get('/my', protect, booking.getMyBookings);
router.get('/:id', protect, booking.getBooking);
router.put('/:id/cancel', protect, booking.cancelBooking);
router.get('/:id/receipt', protect, booking.getReceipt);

export default router;
