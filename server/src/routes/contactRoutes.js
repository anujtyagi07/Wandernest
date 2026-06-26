import { Router } from 'express';
import * as contact from '../controllers/contactController.js';
import { verifyCaptcha } from '../middleware/captcha.js';
import { validate } from '../middleware/validate.js';
import { contactSchema } from '../validators/commonValidator.js';

const router = Router();

router.post('/', verifyCaptcha, validate(contactSchema), contact.submitContact);

export default router;
