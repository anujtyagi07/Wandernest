import { Router } from 'express';
import * as review from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { reviewSchema } from '../validators/commonValidator.js';

const router = Router();

router.post('/', protect, validate(reviewSchema), review.createReview);
router.get('/package/:id', review.getPackageReviews);
router.get('/hotel/:id', review.getHotelReviews);

export default router;
