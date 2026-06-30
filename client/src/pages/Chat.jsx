import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, MessageCircle, ArrowLeft, Check, CheckCheck,
  Clock, User, Loader2
} from 'lucide-react';
import { io } from 'socket.io-client';
import useAuthStore from '../store/authStore';
import { chatService } from '../services/chatService';
import { env } from '../config/env.js';

const SOCKET_URL = env.SOCKET_URL;

/* ================================================
   CHAT PAGE
   ================================================ */
const Chat = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) navigate('/auth');
  }, [isAuthenticated, navigate]);

  // Fetch conversations
  useEffect(() => {
    if (!isAuthenticated) return;
    loadConversations();
  }, [isAuthenticated]);

  // Setup Socket.IO
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const token = localStorage.getItem('wn-token');
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('receive:message', (msg) => {
      if (activeChat && (msg.chat === activeChat._id || msg.chat === activeChat.id)) {
        setMessages((prev) => [...prev, msg]);
        // Mark as read
        chatService.markRead(activeChat._id || activeChat.id).catch(() => {});
      } else {
        // Refresh conversations list for unread indicator
        loadConversations();
      }
    });

    socket.on('typing:indicator', ({ chatId, userId, isTyping }) => {
      // Could add typing indicator UI here
    });

    socket.on('messages:read', ({ chatId, userId }) => {
      if (activeChat && (chatId === activeChat._id || chatId === activeChat.id)) {
        setMessages((prev) =>
          prev.map((m) =>
            m.sender?._id !== userId ? { ...m, isRead: true } : m
          )
        );
      }
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, user, activeChat]);

  // Load messages when active chat changes
  useEffect(() => {
    if (!activeChat) return;
    loadMessages(activeChat._id || activeChat.id);

    // Join chat room
    if (socketRef.current) {
      socketRef.current.emit('join:chat', activeChat._id || activeChat.id);
    }
  }, [activeChat]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const res = await chatService.getConversations();
      setConversations(res.data?.conversations || res.data || []);
    } catch {
      setConversations([]);
    } finally {
      setLoadingConvos(false);
    }
  };

  const loadMessages = async (chatId) => {
    setLoadingMessages(true);
    try {
      const res = await chatService.getMessages(chatId);
      setMessages(res.data?.messages || res.data || []);
      // Mark as read
      await chatService.markRead(chatId);
    } catch {
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || sending) return;

    const chatId = activeChat._id || activeChat.id;
    const text = newMessage.trim();
    setNewMessage('');
    setSending(true);

    // Optimistic update
    const tempMsg = {
      _id: `temp-${Date.now()}`,
      chat: chatId,
      sender: { _id: user._id || user.id, name: user.name },
      text,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      // Send via REST API (also broadcasts via Socket.IO)
      await chatService.sendMessage(chatId, text);
      // Also emit via socket for real-time
      if (socketRef.current) {
        socketRef.current.emit('send:message', { chatId, text });
      }
    } catch (err) {
      // Remove temp message on failure
      setMessages((prev) => prev.filter((m) => m._id !== tempMsg._id));
    } finally {
      setSending(false);
    }
  };

  const getOtherParticipant = (convo) => {
    const userId = user?._id || user?.id;
    return convo.participants?.find((p) => p.user !== userId && p.user?._id !== userId) || convo.participants?.[0];
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    if (diff < 86400000 && d.getDate() === now.getDate()) return formatTime(date);
    if (diff < 172800000) return 'Yesterday';
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="pt-20 pb-8 bg-surface-dim relative overflow-hidden h-screen flex flex-col">
      <div className="container-custom flex-1 flex overflow-hidden">
        <div className="flex-1 flex rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
          {/* Conversations List */}
          <div className={`w-full md:w-80 lg:w-96 border-r border-gray-100 flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
            {/* Header */}
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-xl font-heading font-bold text-heading flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary-500" />
                Messages
              </h2>
              <p className="text-xs text-gray-400 mt-1">Chat with property owners about your bookings</p>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {loadingConvos ? (
                <div className="p-8 text-center">
                  <Loader2 className="w-6 h-6 text-gray-300 animate-spin mx-auto" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageCircle className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No conversations yet</p>
                  <p className="text-gray-300 text-xs mt-1">Chats will appear here after booking</p>
                </div>
              ) : (
                conversations.map((convo) => {
                  const other = getOtherParticipant(convo);
                  const isActive = activeChat && (activeChat._id || activeChat.id) === (convo._id || convo.id);
                  return (
                    <button
                      key={convo._id || convo.id}
                      onClick={() => setActiveChat(convo)}
                      className={`w-full p-4 flex items-center gap-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                        isActive ? 'bg-primary-50 border-l-2 border-l-primary-500' : ''
                      }`}
                    >
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center shrink-0">
                        <span className="text-white font-semibold text-sm">
                          {other?.name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm text-heading truncate">{other?.name || 'Chat'}</h4>
                          {convo.lastMessage && (
                            <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                              {formatDate(convo.lastMessage.createdAt)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {convo.lastMessage?.text || 'Start a conversation'}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className={`flex-1 flex flex-col ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
            {activeChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                  <button
                    onClick={() => setActiveChat(null)}
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {getOtherParticipant(activeChat)?.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-heading">
                      {getOtherParticipant(activeChat)?.name || 'Chat'}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {getOtherParticipant(activeChat)?.role === 'owner' ? 'Property Owner' : 'Traveler'}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50">
                  {loadingMessages ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 text-gray-300 animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-16">
                      <MessageCircle className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMine = msg.sender?._id === (user?._id || user?.id);
                      return (
                        <div key={msg._id || msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                            isMine
                              ? 'gradient-primary text-white rounded-br-sm'
                              : 'bg-white border border-gray-100 text-heading rounded-bl-sm'
                          }`}>
                            <p className="text-sm">{msg.text}</p>
                            <div className={`flex items-center gap-1 mt-1 ${isMine ? 'justify-end' : ''}`}>
                              <span className={`text-[10px] ${isMine ? 'text-white/60' : 'text-gray-400'}`}>
                                {formatTime(msg.createdAt)}
                              </span>
                              {isMine && (
                                msg.isRead
                                  ? <CheckCheck className="w-3 h-3 text-white/80" />
                                  : <Check className="w-3 h-3 text-white/50" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-4 border-t border-gray-100 flex items-center gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-primary-400 focus:bg-white outline-none transition-all text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center text-white disabled:opacity-40 hover:shadow-lg transition-shadow"
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-primary-300" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-heading mb-2">Your Messages</h3>
                  <p className="text-gray-400 text-sm max-w-xs">
                    Select a conversation to start chatting with property owners about your bookings
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
