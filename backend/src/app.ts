import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './shared/middleware/error-handler.middleware';
import { xssSanitize } from './shared/middleware/xss.middleware';
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
import parentDashboardRoutes from './modules/parent-dashboard/parent-dashboard.routes';
import studentRoutes from './modules/student/student.routes';
import parentRoutes from './modules/parent/parent.routes';
import examRoutes from './modules/exam/exam.routes';
import feeRoutes from './modules/fee/fee.routes';
import notificationRoutes from './modules/notification/notification.routes';
import reportRoutes from './modules/reports/reports.routes';
import referencesRoutes from './modules/references/references.routes';
import paymentRoutes from './modules/payment/payment.routes';
import branchRoutes from './modules/branch/branch.routes';
import certificateRoutes from './modules/certificate/certificate.routes';
import admissionRoutes from './modules/admission/admission.routes';
import enrollmentRoutes from './modules/enrollment/enrollment.routes';
import batchRoutes from './modules/batch/batch.routes';
import revaluationRoutes from './modules/revaluation/revaluation.routes';
import scholarshipRoutes from './modules/scholarship/scholarship.routes';
import cloudDocumentsRoutes from './modules/cloud-documents/cloud-documents.routes';
import paymentGatewayRoutes from './modules/payment-gateways/payment-gateways.routes';

const app = express();

// Security headers — before everything
app.use(helmet());
const allowedOrigins = env.CORS_ORIGIN.split(',').map(o => o.trim());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin || allowedOrigins[0]);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

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
app.use(cookieParser(env.COOKIE_SECRET));

// Swagger API docs
import { setupSwagger } from './config/swagger';
setupSwagger(app);

// XSS sanitization
app.use(xssSanitize);

// Stricter rate limiter for auth routes (login attempts)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many login attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth', authLimiter);
app.use('/api/student-auth', authLimiter);

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
app.use('/api/parent-dashboard', parentDashboardRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/references', referencesRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/revaluations', revaluationRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/cloud-documents', cloudDocumentsRoutes);
app.use('/api/payment-gateways', paymentGatewayRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
