import Hotel from '../models/Hotel.js';
import AppError from '../utils/AppError.js';
import { parsePagination, paginatedResponse } from '../utils/helpers.js';

/**
 * GET /api/v1/hotels
 */
export const getHotels = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { location, type, sort, search } = req.query;

    const filter = { isActive: true };
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (type) filter.type = { $regex: type, $options: 'i' };
    if (search) filter.$text = { $search: search };

    let sortObj = { createdAt: -1 };
    if (sort === 'price-asc') sortObj = { pricePerNight: 1 };
    if (sort === 'price-desc') sortObj = { pricePerNight: -1 };
    if (sort === 'rating') sortObj = { rating: -1 };
    if (sort === 'name') sortObj = { name: 1 };

    const [hotels, total] = await Promise.all([
      Hotel.find(filter).sort(sortObj).skip(skip).limit(limit),
      Hotel.countDocuments(filter),
    ]);

    res.json({ success: true, ...paginatedResponse(hotels, total, page, limit) });
  } catch (error) { next(error); }
};

/**
 * GET /api/v1/hotels/:id
 */
export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return next(AppError.notFound('Hotel not found'));
    res.json({ success: true, data: hotel });
  } catch (error) { next(error); }
};
