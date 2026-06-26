import Destination from '../models/Destination.js';
import AppError from '../utils/AppError.js';

/**
 * GET /api/v1/destinations
 */
export const getDestinations = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = { $regex: category, $options: 'i' };
    if (search) filter.$text = { $search: search };

    const destinations = await Destination.find(filter).sort({ name: 1 });
    res.json({ success: true, data: destinations });
  } catch (error) { next(error); }
};

/**
 * GET /api/v1/destinations/:slug
 */
export const getDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findOne({ slug: req.params.slug, isActive: true })
      .populate('linkedPackages', 'title basePrice duration images rating')
      .populate('linkedHotels', 'name pricePerNight rating images');

    if (!destination) return next(AppError.notFound('Destination not found'));
    res.json({ success: true, data: destination });
  } catch (error) { next(error); }
};
