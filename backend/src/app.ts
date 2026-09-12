import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutesImport from './routes/authRoutes';
import userRoutesImport from './routes/userRoutes';
import bookingRoutesImport from './routes/bookingRoutes';
import serviceRoutesImport from './routes/serviceRoutes';
import technicianRoutesImport from './routes/technicianRoutes';
import notificationRoutesImport from './routes/notificationRoutes';
import adminRoutesImport from './routes/adminRoutes';
import paymentRoutesImport from './routes/paymentRoutes';
import reviewRoutesImport from './routes/reviewRoutes';
import supportRoutesImport from './routes/supportRoutes';
import couponRoutesImport from './routes/couponRoutes';
import aiRoutesImport from './routes/aiRoutes';
import { notFound, errorHandler } from './middleware/errorMiddleware';

const unwrap = (m: any) => (m && m.default ? m.default : m);
const authRoutes = unwrap(authRoutesImport);
const userRoutes = unwrap(userRoutesImport);
const bookingRoutes = unwrap(bookingRoutesImport);
const serviceRoutes = unwrap(serviceRoutesImport);
const technicianRoutes = unwrap(technicianRoutesImport);
const notificationRoutes = unwrap(notificationRoutesImport);
const adminRoutes = unwrap(adminRoutesImport);
const paymentRoutes = unwrap(paymentRoutesImport);
const reviewRoutes = unwrap(reviewRoutesImport);
const supportRoutes = unwrap(supportRoutesImport);
const couponRoutes = unwrap(couponRoutesImport);
const aiRoutes = unwrap(aiRoutesImport);

const app = express();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/technicians', technicianRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/ai', aiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
