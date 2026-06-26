import { Router } from 'express';
import * as dest from '../controllers/destinationController.js';

const router = Router();

router.get('/', dest.getDestinations);
router.get('/:slug', dest.getDestination);

export default router;
