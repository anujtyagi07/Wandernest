import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Package from '../models/Package.js';
import Hotel from '../models/Hotel.js';
import Destination from '../models/Destination.js';
import Review from '../models/Review.js';
import Contact from '../models/Contact.js';
import NewsletterSubscriber from '../models/NewsletterSubscriber.js';
import PriceConfig from '../models/PriceConfig.js';
import AppError from '../utils/AppError.js';
import { parsePagination, paginatedResponse, slugify } from '../utils/helpers.js';
import { generateBookingReceipt } from '../services/pdfService.js';

// ── Dashboard Stats ──
export const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalBookings, totalRevenue, pendingBookings, totalPackages, totalHotels] = await Promise.all([
      User.countDocuments(),
      Booking.countDocuments(),
      Booking.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Booking.countDocuments({ status: 'pending' }),
      Package.countDocuments(),
      Hotel.countDocuments(),
    ]);

    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate('package', 'title')
      .populate('hotel', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingBookings,
        totalPackages,
        totalHotels,
        recentBookings,
      },
    });
  } catch (error) { next(error); }
};

// ── Analytics ──
export const getAnalytics = async (req, res, next) => {
  try {
    const { period = '30' } = req.query;
    const daysAgo = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000);

    const [bookingsByStatus, bookingsOverTime, topPackages, revenueByMonth] = await Promise.all([
      Booking.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Booking.aggregate([
        { $match: { createdAt: { $gte: daysAgo } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
        { $sort: { _id: 1 } },
      ]),
      Booking.aggregate([
        { $match: { bookingType: 'package', status: { $in: ['confirmed', 'completed'] } } },
        { $group: { _id: '$package', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'packages', localField: '_id', foreignField: '_id', as: 'pkg' } },
        { $unwind: '$pkg' },
        { $project: { title: '$pkg.title', count: 1, revenue: 1 } },
      ]),
      Booking.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, revenue: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
        { $sort: { _id: -1 } },
        { $limit: 12 },
      ]),
    ]);

    res.json({ success: true, data: { bookingsByStatus, bookingsOverTime, topPackages, revenueByMonth } });
  } catch (error) { next(error); }
};

// ── User Management ──
export const getUsers = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { search, role } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];

    const [users, total] = await Promise.all([
      User.find(filter).select('-passwordHash -refreshToken').sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    res.json({ success: true, ...paginatedResponse(users, total, page, limit) });
  } catch (error) { next(error); }
};

export const updateUser = async (req, res, next) => {
  try {
    const { role, name, phone, isEmailVerified } = req.body;
    const updates = {};
    if (role) updates.role = role;
    if (name) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (isEmailVerified !== undefined) updates.isEmailVerified = isEmailVerified;

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-passwordHash -refreshToken');
    if (!user) return next(AppError.notFound('User not found'));

    res.json({ success: true, data: user });
  } catch (error) { next(error); }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(AppError.notFound('User not found'));
    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return next(AppError.badRequest('Cannot delete your own account'));
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) { next(error); }
};

// ── Booking Management ──
export const getAllBookings = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { status, bookingType } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (bookingType) filter.bookingType = bookingType;

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('user', 'name email')
        .populate('package', 'title')
        .populate('hotel', 'name')
        .sort({ createdAt: -1 })
        .skip(skip).limit(limit),
      Booking.countDocuments(filter),
    ]);

    res.json({ success: true, ...paginatedResponse(bookings, total, page, limit) });
  } catch (error) { next(error); }
};

export const updateBooking = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, ...(status === 'confirmed' ? { confirmedAt: new Date() } : {}), ...(status === 'cancelled' ? { cancelledAt: new Date() } : {}) },
      { new: true }
    ).populate('user', 'name email');

    if (!booking) return next(AppError.notFound('Booking not found'));
    res.json({ success: true, data: booking });
  } catch (error) { next(error); }
};

/**
 * POST /api/v1/admin/bookings/:id/confirm-payment
 * Admin confirms payment: sets paymentStatus=paid, status=confirmed, generates PDF receipt
 */
export const confirmBookingPayment = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return next(AppError.notFound('Booking not found'));
    if (booking.status !== 'pending') {
      return next(AppError.badRequest('Only pending bookings can be confirmed'));
    }

    // Mark payment as paid and booking as confirmed
    booking.paymentId = booking.paymentId || `admin_pay_${Date.now()}`;
    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    booking.confirmedAt = new Date();
    await booking.save();

    // Generate PDF receipt
    try {
      const packageOrHotel = booking.bookingType === 'package'
        ? await Package.findById(booking.package)
        : await Hotel.findById(booking.hotel);
      const receiptUrl = await generateBookingReceipt(booking, packageOrHotel);
      booking.receiptUrl = receiptUrl;
      await booking.save();
    } catch (pdfErr) {
      // Don't fail the whole request if PDF generation fails
      console.error('PDF receipt generation failed:', pdfErr.message);
    }

    const updated = await Booking.findById(booking._id)
      .populate('user', 'name email')
      .populate('package', 'title')
      .populate('hotel', 'name');

    res.json({ success: true, message: 'Payment confirmed', data: updated });
  } catch (error) { next(error); }
};

// ── Package CRUD ──
export const createPackage = async (req, res, next) => {
  try {
    const pkg = await Package.create(req.body);
    res.status(201).json({ success: true, data: pkg });
  } catch (error) { next(error); }
};

export const updatePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pkg) return next(AppError.notFound('Package not found'));
    res.json({ success: true, data: pkg });
  } catch (error) { next(error); }
};

export const deletePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!pkg) return next(AppError.notFound('Package not found'));
    res.json({ success: true, message: 'Package archived' });
  } catch (error) { next(error); }
};

// ── Hotel CRUD ──
export const createHotel = async (req, res, next) => {
  try {
    const data = { ...req.body, slug: slugify(req.body.name) };
    const hotel = await Hotel.create(data);
    res.status(201).json({ success: true, data: hotel });
  } catch (error) { next(error); }
};

export const updateHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!hotel) return next(AppError.notFound('Hotel not found'));
    res.json({ success: true, data: hotel });
  } catch (error) { next(error); }
};

export const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Hotel archived' });
  } catch (error) { next(error); }
};

// ── Destination CRUD ──
export const createDestination = async (req, res, next) => {
  try {
    const data = { ...req.body, slug: slugify(req.body.name) };
    const dest = await Destination.create(data);
    res.status(201).json({ success: true, data: dest });
  } catch (error) { next(error); }
};

export const updateDestination = async (req, res, next) => {
  try {
    const dest = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!dest) return next(AppError.notFound('Destination not found'));
    res.json({ success: true, data: dest });
  } catch (error) { next(error); }
};

export const deleteDestination = async (req, res, next) => {
  try {
    await Destination.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Destination archived' });
  } catch (error) { next(error); }
};

// ── Review Moderation ──
export const getPendingReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ isApproved: false })
      .populate('user', 'name email')
      .populate('package', 'title')
      .populate('hotel', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (error) { next(error); }
};

export const moderateReview = async (req, res, next) => {
  try {
    const { isApproved, adminNote } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved, adminNote: adminNote || '' },
      { new: true }
    );
    if (!review) return next(AppError.notFound('Review not found'));
    res.json({ success: true, data: review });
  } catch (error) { next(error); }
};

// ── Inquiry Management ──
export const getInquiries = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const [inquiries, total] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Contact.countDocuments(filter),
    ]);

    res.json({ success: true, ...paginatedResponse(inquiries, total, page, limit) });
  } catch (error) { next(error); }
};

export const updateInquiry = async (req, res, next) => {
  try {
    const { status, adminNote } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (adminNote) updates.$push = { adminNotes: { note: adminNote } };

    const inquiry = await Contact.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!inquiry) return next(AppError.notFound('Inquiry not found'));
    res.json({ success: true, data: inquiry });
  } catch (error) { next(error); }
};

// ── Newsletter Management ──
export const getSubscribers = async (req, res, next) => {
  try {
    const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 });
    res.json({ success: true, data: subscribers });
  } catch (error) { next(error); }
};

// ── Price Config ──
export const updatePriceConfig = async (req, res, next) => {
  try {
    const config = await PriceConfig.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    res.json({ success: true, data: config });
  } catch (error) { next(error); }
};

// ── Settings ──
export const getSettings = async (_req, res, next) => {
  try {
    // Settings stored as a simple key-value doc (or env-based for now)
    res.json({ success: true, data: { siteName: 'WanderNest', contactEmail: 'hello@wandernest.in' } });
  } catch (error) { next(error); }
};
