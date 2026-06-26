import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import AppError from '../utils/AppError.js';
import { BOOKING_STATUS } from '../config/constants.js';
import { parsePagination, paginatedResponse } from '../utils/helpers.js';

/**
 * POST /api/v1/reviews
 */
export const createReview = async (req, res, next) => {
  try {
    const { packageId, hotelId, bookingId, rating, title, comment } = req.body;

    // Verify booking exists and belongs to user and is completed
    const booking = await Booking.findById(bookingId);
    if (!booking) return next(AppError.notFound('Booking not found'));
    if (booking.user.toString() !== req.user._id.toString()) return next(AppError.forbidden());
    if (booking.status !== BOOKING_STATUS.COMPLETED && booking.status !== BOOKING_STATUS.CONFIRMED) {
      return next(AppError.badRequest('You can only review completed or confirmed bookings'));
    }

    // Check for existing review
    const existing = await Review.findOne({
      user: req.user._id,
      booking: bookingId,
    });
    if (existing) return next(AppError.conflict('You have already reviewed this booking'));

    const review = await Review.create({
      user: req.user._id,
      package: packageId || undefined,
      hotel: hotelId || undefined,
      booking: bookingId,
      rating,
      title: title || '',
      comment: comment || '',
    });

    res.status(201).json({ success: true, message: 'Review submitted (pending approval)', data: review });
  } catch (error) { next(error); }
};

/**
 * GET /api/v1/reviews/package/:id
 */
export const getPackageReviews = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);

    const [reviews, total] = await Promise.all([
      Review.find({ package: req.params.id, isApproved: true })
        .populate('user', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Review.countDocuments({ package: req.params.id, isApproved: true }),
    ]);

    res.json({ success: true, ...paginatedResponse(reviews, total, page, limit) });
  } catch (error) { next(error); }
};

/**
 * GET /api/v1/reviews/hotel/:id
 */
export const getHotelReviews = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);

    const [reviews, total] = await Promise.all([
      Review.find({ hotel: req.params.id, isApproved: true })
        .populate('user', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Review.countDocuments({ hotel: req.params.id, isApproved: true }),
    ]);

    res.json({ success: true, ...paginatedResponse(reviews, total, page, limit) });
  } catch (error) { next(error); }
};
