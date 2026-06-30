import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import connectDB from './config/db.js';
import { env } from './config/env.js';
import { verifyAccessToken } from './utils/tokenGenerator.js';
import { setupChatSocket } from './services/chatService.js';
import { setupCronJobs } from './jobs/cronJobs.js';

const server = createServer(app);

// ── Socket.IO Setup ──
const io = new Server(server, {
  cors: {
    origin: env.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket.IO auth middleware
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    if (!token) return next(new Error('Authentication required'));
    const decoded = verifyAccessToken(token);
    socket.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch {
    next(new Error('Invalid token'));
  }
});

setupChatSocket(io);

// Attach io to app for use in controllers
app.set('io', io);

// ── Start Server ──
const PORT = env.PORT;

// Start server immediately so Railway health check passes
server.listen(PORT, () => {
  console.log(`\n  WanderNest Server running on port ${PORT}`);
  console.log(`  Environment: ${env.NODE_ENV}`);
  console.log(`  Client URL: ${env.CLIENT_URL}\n`);
});

// Connect to DB in background — server stays alive even if DB fails
connectDB().then(() => {
  setupCronJobs();
}).catch((err) => {
  console.error('Failed to connect to database:', err.message);
  console.error('Server is running but DB-dependent features will not work.');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down...');
  server.close(() => process.exit(0));
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err.message);
});
