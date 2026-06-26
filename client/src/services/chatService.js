import api from './api';

export const chatService = {
  getConversations: () => api.get('/chat/conversations'),
  getMessages: (chatId, params = {}) => api.get(`/chat/${chatId}/messages`, { params }),
  sendMessage: (chatId, text) => api.post(`/chat/${chatId}/messages`, { text }),
  markRead: (chatId) => api.put(`/chat/${chatId}/messages/read`),
};
