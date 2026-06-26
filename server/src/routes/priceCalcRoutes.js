import { Router } from 'express';
import * as priceCalc from '../controllers/priceCalcController.js';

const router = Router();

router.get('/config', priceCalc.getConfig);
router.post('/calculate', priceCalc.calculate);

export default router;
