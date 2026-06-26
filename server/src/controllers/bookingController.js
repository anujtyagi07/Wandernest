import Booking from '../models/Booking.js';
import Package from '../models/Package.js';
import Hotel from '../models/Hotel.js';
import Chat from '../models/Chat.js';
import AppError from '../utils/AppError.js';
import { generateBookingReceipt } from '../services/pdfService.js';
import { sendBookingConfirmation } from '../services/emailService.js';
import { createOrder } from '../services/paymentService.js';
import { verifyOtp } from '../services/otpService.js';
import { calculateRefundPercentage } from '../utils/helpers.js';
import { BOOKING_STATUS, PAYMENT_STATUS } from '../config/constants.js';
import { parsePagination, paginatedResponse } from '../utils/helpers.js';

/**
 * POST /api/v1/bookings
 */
export const createBooking = async (req, res, next) => {
  try {
    const {
      bookingType, packageId, hotelId,
      traveler, travelDate, adults, children,
      totalAmount, specialRequests,
      otpPhone, otpCode,
    } = req.body;

    // Validate OTP
    if (otpPhone && otpCode) {
      await verifyOtp(otpPhone, otpCode);
    }

    // Validate package/hotel exists
    if (bookingType === 'package' && packageId) {
      const pkg = await Package.findById(packageId);
      if (!pkg) return next(AppError.notFound('Package not found'));
    }
    if (bookingType === 'hotel' && hotelId) {
      const hotel = await Hotel.findById(hotelId);
      if (!hotel) return next(AppError.notFound('Hotel not found'));
    }

    // Create Razorpay order
    const order = await createOrder(totalAmount, 'INR', `booking_${Date.now()}`);

    const booking = await Booking.create({
      user: req.user._id,
      bookingType,
      package: packageId || undefined,
      hotel: hotelId || undefined,
      traveler,
      travelDate,
      adults,
      children: children || 0,
      totalAmount,
      specialRequests: specialRequests || '',
      razorpayOrderId: order.id,
      otpVerified: !!(otpPhone && otpCode),
      status: BOOKING_STATUS.PENDING,
      paymentStatus: PAYMENT_STATUS.PENDING,
    });

    res.status(201).json({
      success: true,
      message: 'Booking created',
      data: booking,
      order,
    });
  } catch (error) { next(error); }
};

/**
 * POST /api/v1/bookings/:id/confirm-payment
 */
export const confirmPayment = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return next(AppError.notFound('Booking not found'));
    if (booking.user.toString() !== req.user._id.toString()) return next(AppError.forbidden());

    const { paymentId } = req.body;

    booking.paymentId = paymentId || `pay_${Date.now()}`;
    booking.paymentStatus = PAYMENT_STATUS.PAID;
    booking.status = BOOKING_STATUS.CONFIRMED;
    booking.confirmedAt = new Date();
    await booking.save();

    // Generate PDF receipt
    const packageOrHotel = booking.bookingType === 'package'
      ? await Package.findById(booking.package)
      : await Hotel.findById(booking.hotel);

    const receiptUrl = await generateBookingReceipt(booking, packageOrHotel);
    booking.receiptUrl = receiptUrl;
    await booking.save();

    // Create chat conversation
    const ownerUser = { name: 'WanderNest Support' };
    await Chat.create({
      participants: [
        { user: req.user._id, role: 'booker', name: req.user.name },
        { user: req.user._id, role: 'owner', name: ownerUser.name },
      ],
      booking: booking._id,
    });

    // Send confirmation email
    await sendBookingConfirmation(booking, req.user);

    res.json({ success: true, message: 'Booking confirmed', data: booking });
  } catch (error) { next(error); }
};

/**
 * GET /api/v1/bookings/my
 */
export const getMyBookings = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { status } = req.query;

    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('package', 'title location images basePrice')
        .populate('hotel', 'name location images pricePerNight')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Booking.countDocuments(filter),
    ]);

    res.json({ success: true, ...paginatedResponse(bookings, total, page, limit) });
  } catch (error) { next(error); }
};

/**
 * GET /api/v1/bookings/:id
 */
export const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('package', 'title location images basePrice duration')
      .populate('hotel', 'name location images pricePerNight');

    if (!booking) return next(AppError.notFound('Booking not found'));
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(AppError.forbidden());
    }

    res.json({ success: true, data: booking });
  } catch (error) { next(error); }
};

/**
 * PUT /api/v1/bookings/:id/cancel
 */
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return next(AppError.notFound('Booking not found'));
    if (booking.user.toString() !== req.user._id.toString()) return next(AppError.forbidden());
    if (booking.status === BOOKING_STATUS.CANCELLED) return next(AppError.badRequest('Booking already cancelled'));

    const refundPct = calculateRefundPercentage(booking.travelDate);

    booking.status = BOOKING_STATUS.CANCELLED;
    booking.cancelledAt = new Date();

    if (booking.paymentStatus === PAYMENT_STATUS.PAID && refundPct > 0) {
      booking.paymentStatus = PAYMENT_STATUS.REFUNDED;
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled',
      data: booking,
      refundPercentage: Math.round(refundPct * 100),
    });
  } catch (error) { next(error); }
};

/**
 * GET /api/v1/bookings/:id/receipt
 */
export const getReceipt = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return next(AppError.notFound('Booking not found'));
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(AppError.forbidden());
    }

    // Generate receipt if not exists
    if (!booking.receiptUrl) {
      const packageOrHotel = booking.bookingType === 'package'
        ? await Package.findById(booking.package)
        : await Hotel.findById(booking.hotel);

      const receiptUrl = await generateBookingReceipt(booking, packageOrHotel);
      booking.receiptUrl = receiptUrl;
      await booking.save();
    }

    res.json({ success: true, receiptUrl: booking.receiptUrl });
  } catch (error) { next(error); }
};
