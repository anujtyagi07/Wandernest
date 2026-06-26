import { Router } from 'express';
import * as newsletter from '../controllers/newsletterController.js';
import { validate } from '../middleware/validate.js';
import { newsletterSchema } from '../validators/commonValidator.js';

const router = Router();

router.post('/subscribe', validate(newsletterSchema), newsletter.subscribe);
router.get('/unsubscribe/:token', newsletter.unsubscribe);

export default router;
