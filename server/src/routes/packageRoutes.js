import { Router } from 'express';
import * as pkg from '../controllers/packageController.js';

const router = Router();

router.get('/', pkg.getPackages);
router.get('/featured', pkg.getFeaturedPackages);
router.get('/:id', pkg.getPackage);
router.get('/:id/related', pkg.getRelatedPackages);

export default router;
