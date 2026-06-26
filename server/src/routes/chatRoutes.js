import { Router } from 'express';
import * as chat from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/conversations', protect, chat.getConversations);
router.get('/:chatId/messages', protect, chat.getMessages);
router.post('/:chatId/messages', protect, chat.sendMessage);
router.put('/:chatId/messages/read', protect, chat.markRead);

export default router;
