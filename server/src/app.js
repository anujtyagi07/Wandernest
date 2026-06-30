import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import packageRoutes from './routes/packageRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import destinationRoutes from './routes/destinationRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import priceCalcRoutes from './routes/priceCalcRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Absolute path to uploads directory — works regardless of Railway's working dir
const UPLOADS_DIR = path.resolve(__dirname, '../..', 'uploads');

const app = express();

// ── Security ──
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));

// ── Parsing ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Logging ──
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ── Rate Limiting ──
app.use('/api/', apiLimiter);

// ── Static Files (uploads) ──
app.use('/uploads', express.static(UPLOADS_DIR));

// ── Root ──
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'WanderNest Backend is live 🚀',
    version: '1.0.0',
    environment: env.NODE_ENV,
    timestamp: new Date(),
  });
});

// ── Health Check ──
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'WanderNest API is running', timestamp: new Date() });
});

// ── API Routes ──
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/packages', packageRoutes);
app.use('/api/v1/hotels', hotelRoutes);
app.use('/api/v1/destinations', destinationRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/newsletter', newsletterRoutes);
app.use('/api/v1/price-calculator', priceCalcRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/admin', adminRoutes);

// ── 404 Handler ──
app.use((_req, _res, next) => {
  next({ statusCode: 404, message: 'Route not found' });
});

// ── Global Error Handler ──
app.use(errorHandler);

export default app;
