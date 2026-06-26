import { Router } from 'express';
import * as admin from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { packageSchema, hotelSchema, destinationSchema, reviewSchema } from '../validators/commonValidator.js';

const router = Router();

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// Dashboard
router.get('/stats', admin.getStats);
router.get('/analytics', admin.getAnalytics);
router.get('/settings', admin.getSettings);

// User management
router.get('/users', admin.getUsers);
router.put('/users/:id', admin.updateUser);
router.delete('/users/:id', admin.deleteUser);

// Booking management
router.get('/bookings', admin.getAllBookings);
router.put('/bookings/:id', admin.updateBooking);
router.post('/bookings/:id/confirm-payment', admin.confirmBookingPayment);

// Package CRUD
router.post('/packages', validate(packageSchema), admin.createPackage);
router.put('/packages/:id', admin.updatePackage);
router.delete('/packages/:id', admin.deletePackage);

// Hotel CRUD
router.post('/hotels', validate(hotelSchema), admin.createHotel);
router.put('/hotels/:id', admin.updateHotel);
router.delete('/hotels/:id', admin.deleteHotel);

// Destination CRUD
router.post('/destinations', validate(destinationSchema), admin.createDestination);
router.put('/destinations/:id', admin.updateDestination);
router.delete('/destinations/:id', admin.deleteDestination);

// Review moderation
router.get('/reviews/pending', admin.getPendingReviews);
router.put('/reviews/:id', admin.moderateReview);

// Inquiry management
router.get('/inquiries', admin.getInquiries);
router.put('/inquiries/:id', admin.updateInquiry);

// Newsletter
router.get('/subscribers', admin.getSubscribers);

// Price config
router.put('/price-config', admin.updatePriceConfig);

export default router;
