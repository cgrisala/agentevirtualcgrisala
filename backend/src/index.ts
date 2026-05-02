import express, { Express } from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import cors from 'cors';
import { config } from 'dotenv';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { AppDataSource } from './config/database';

// Routes
import authRoutes from './routes/auth';
import reservationRoutes from './routes/reservations';
import guestRoutes from './routes/guests';
import roomRoutes from './routes/rooms';
import webhookRoutes from './routes/webhooks';
import healthRoutes from './routes/health';

config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging
app.use(requestLogger);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/health', healthRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler (debe ser el último middleware)
app.use(errorHandler);

// Initialize database
AppDataSource.initialize()
  .then(() => {
    logger.info('📊 Database connected successfully');
    app.listen(port, () => {
      logger.info(`🚀 Server running on port ${port} in ${process.env.NODE_ENV} mode`);
    });
  })
  .catch((error) => {
    logger.error('❌ Database connection failed:', error);
    process.exit(1);
  });

export default app;
