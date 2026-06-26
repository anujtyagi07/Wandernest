import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';

/**
 * Setup Socket.IO event handlers for real-time chat
 */
export const setupChatSocket = (io) => {
  io.on('connection', (socket) => {
    const userId = socket.user.id;
    console.log(`[Socket] User connected: ${userId}`);

    // Join a chat room
    socket.on('join:chat', async (chatId) => {
      try {
        const chat = await Chat.findById(chatId);
        if (!chat) return;

        // Verify user is a participant
        const isParticipant = chat.participants.some(
          (p) => p.user.toString() === userId
        );
        if (!isParticipant) return;

        socket.join(chatId);
        console.log(`[Socket] ${userId} joined chat ${chatId}`);
      } catch (err) {
        console.error('[Socket] join:chat error:', err.message);
      }
    });

    // Send a message
    socket.on('send:message', async ({ chatId, text }) => {
      try {
        if (!text || text.trim().length === 0) return;

        // Save message to DB
        const message = await Message.create({
          chat: chatId,
          sender: userId,
          text: text.trim(),
        });

        // Update chat's lastMessage
        await Chat.findByIdAndUpdate(chatId, {
          lastMessage: { text: text.trim(), sender: userId, createdAt: new Date() },
        });

        // Populate sender info
        const populated = await Message.findById(message._id)
          .populate('sender', 'name avatar');

        // Emit to all participants in the room
        io.to(chatId).emit('receive:message', populated);

        // Create notification for other participants
        const chat = await Chat.findById(chatId);
        for (const p of chat.participants) {
          if (p.user.toString() !== userId) {
            await Notification.create({
              user: p.user,
              type: 'chat',
              title: 'New message',
              message: text.trim().substring(0, 100),
              relatedId: chatId,
              relatedType: 'chat',
            });
          }
        }
      } catch (err) {
        console.error('[Socket] send:message error:', err.message);
      }
    });

    // Typing indicator
    socket.on('typing:indicator', ({ chatId, isTyping }) => {
      socket.to(chatId).emit('typing:update', { userId, isTyping });
    });

    // Mark messages as read
    socket.on('mark:read', async (chatId) => {
      try {
        await Message.updateMany(
          { chat: chatId, sender: { $ne: userId }, isRead: false },
          { isRead: true }
        );
        socket.to(chatId).emit('messages:read', { userId, chatId });
      } catch (err) {
        console.error('[Socket] mark:read error:', err.message);
      }
    });

    // Leave a chat room
    socket.on('leave:chat', (chatId) => {
      socket.leave(chatId);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${userId}`);
    });
  });
};
