import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import AppError from '../utils/AppError.js';
import { parsePagination, paginatedResponse } from '../utils/helpers.js';

/**
 * GET /api/v1/chat/conversations
 */
export const getConversations = async (req, res, next) => {
  try {
    const chats = await Chat.find({
      'participants.user': req.user._id,
      isActive: true,
    })
      .populate('booking', 'bookingType travelDate status')
      .sort({ 'lastMessage.createdAt': -1 });

    res.json({ success: true, data: chats });
  } catch (error) { next(error); }
};

/**
 * GET /api/v1/chat/:chatId/messages
 */
export const getMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { page, limit, skip } = parsePagination(req.query);

    const chat = await Chat.findById(chatId);
    if (!chat) return next(AppError.notFound('Conversation not found'));

    const isParticipant = chat.participants.some((p) => p.user.toString() === req.user._id.toString());
    if (!isParticipant) return next(AppError.forbidden());

    const [messages, total] = await Promise.all([
      Message.find({ chat: chatId })
        .populate('sender', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Message.countDocuments({ chat: chatId }),
    ]);

    res.json({ success: true, ...paginatedResponse(messages.reverse(), total, page, limit) });
  } catch (error) { next(error); }
};

/**
 * POST /api/v1/chat/:chatId/messages
 */
export const sendMessage = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) return next(AppError.badRequest('Message text is required'));

    const chat = await Chat.findById(chatId);
    if (!chat) return next(AppError.notFound('Conversation not found'));

    const isParticipant = chat.participants.some((p) => p.user.toString() === req.user._id.toString());
    if (!isParticipant) return next(AppError.forbidden());

    const message = await Message.create({
      chat: chatId,
      sender: req.user._id,
      text: text.trim(),
    });

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: { text: text.trim(), sender: req.user._id, createdAt: new Date() },
    });

    const populated = await Message.findById(message._id).populate('sender', 'name avatar');

    // Emit via Socket.IO if available
    const io = req.app.get('io');
    if (io) {
      io.to(chatId).emit('receive:message', populated);
    }

    res.status(201).json({ success: true, data: populated });
  } catch (error) { next(error); }
};

/**
 * PUT /api/v1/chat/:chatId/messages/read
 */
export const markRead = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    await Message.updateMany(
      { chat: chatId, sender: { $ne: req.user._id }, isRead: false },
      { isRead: true }
    );

    res.json({ success: true, message: 'Messages marked as read' });
  } catch (error) { next(error); }
};
