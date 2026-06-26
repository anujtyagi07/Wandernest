import { Router } from 'express';
import * as hotel from '../controllers/hotelController.js';

const router = Router();

router.get('/', hotel.getHotels);
router.get('/:id', hotel.getHotel);

export default router;
