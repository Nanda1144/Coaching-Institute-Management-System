import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './shared/middleware/error-handler.middleware';
import { getDatabaseHealth } from './config/database';

import authRoutes from './modules/auth/auth.routes';
import facultyRoutes from './modules/faculty/faculty.routes';
import timetableRoutes from './modules/timetable/timetable.routes';
import attendanceRoutes from './modules/attendance/attendance.routes';
import holidayRoutes from './modules/holiday/holiday.routes';
import assignmentRoutes from './modules/assignment/assignment.routes';
import homeworkRoutes from './modules/homework/homework.routes';
import submissionRoutes from './modules/submission/submission.routes';
import evaluationRoutes from './modules/evaluation/evaluation.routes';
import materialRoutes from './modules/material/material.routes';
import uploadRoutes from './modules/upload/upload.routes';
import reminderRoutes from './modules/reminder/reminder.routes';
import facultyTransferRoutes from './modules/faculty-transfer/faculty-transfer.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import studentAuthRoutes from './modules/student-auth/student-auth.routes';
import studentDashboardRoutes from './modules/student-dashboard/student-dashboard.routes';

const app = express();

// Security headers — before everything
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));

// Request logging
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Health endpoint — before rate limiting so it's always accessible
app.get('/api/health', async (_req, res) => {
  const dbHealth = await getDatabaseHealth();
  const status = dbHealth.status === 'connected' ? 'healthy' : 'degraded';
  const statusCode = dbHealth.status === 'disconnected' ? 503 : 200;
  res.status(statusCode).json({
    success: status === 'healthy',
    message: `College ERP API is ${status}`,
    timestamp: new Date().toISOString(),
    database: dbHealth,
  });
});

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  message: { success: false, message: 'Too many requests, please try again later' },
  skip: (req) => req.path === '/api/health',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Stricter rate limiter for dashboard (heavy aggregation queries)
const dashboardLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: Math.max(Math.floor(env.RATE_LIMIT_MAX / 2), 50),
  message: { success: false, message: 'Too many requests, please try again later' },
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/homework', homeworkRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/faculty-transfers', facultyTransferRoutes);
app.use('/api/dashboard', dashboardLimiter, dashboardRoutes);
app.use('/api/student-auth', studentAuthRoutes);
app.use('/api/student-dashboard', studentDashboardRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
