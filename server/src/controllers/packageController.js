import Package from '../models/Package.js';
import AppError from '../utils/AppError.js';
import { parsePagination, paginatedResponse } from '../utils/helpers.js';

/**
 * GET /api/v1/packages
 */
export const getPackages = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { location, category, search, sort, featured } = req.query;

    const filter = { isActive: true };
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (category) filter.category = { $regex: category, $options: 'i' };
    if (featured === 'true') filter.isFeatured = true;
    if (search) filter.$text = { $search: search };

    let sortObj = { createdAt: -1 };
    if (sort === 'price-asc') sortObj = { basePrice: 1 };
    if (sort === 'price-desc') sortObj = { basePrice: -1 };
    if (sort === 'rating') sortObj = { rating: -1 };
    if (sort === 'name') sortObj = { title: 1 };

    const [packages, total] = await Promise.all([
      Package.find(filter).sort(sortObj).skip(skip).limit(limit),
      Package.countDocuments(filter),
    ]);

    res.json({ success: true, ...paginatedResponse(packages, total, page, limit) });
  } catch (error) { next(error); }
};

/**
 * GET /api/v1/packages/featured
 */
export const getFeaturedPackages = async (req, res, next) => {
  try {
    const packages = await Package.find({ isActive: true, isFeatured: true }).sort({ rating: -1 }).limit(6);
    res.json({ success: true, data: packages });
  } catch (error) { next(error); }
};

/**
 * GET /api/v1/packages/:id
 */
export const getPackage = async (req, res, next) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return next(AppError.notFound('Package not found'));
    res.json({ success: true, data: pkg });
  } catch (error) { next(error); }
};

/**
 * GET /api/v1/packages/:id/related
 */
export const getRelatedPackages = async (req, res, next) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return next(AppError.notFound('Package not found'));

    const related = await Package.find({
      _id: { $ne: pkg._id },
      isActive: true,
      $or: [
        { location: { $regex: pkg.location, $options: 'i' } },
        { category: pkg.category },
      ],
    }).limit(4);

    res.json({ success: true, data: related });
  } catch (error) { next(error); }
};
