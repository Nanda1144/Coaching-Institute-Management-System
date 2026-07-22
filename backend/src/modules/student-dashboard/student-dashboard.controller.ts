import { Response, NextFunction } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { sendSuccess, sendError } from '../../shared/utils/api-response';
import { studentDashboardService } from './student-dashboard.service';

export const getOverview = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const studentId = req.user?.id;
  if (!studentId) { sendError(res, 401, 'Authentication required'); return; }
  const data = await studentDashboardService.getOverview(studentId);
  sendSuccess(res, data, 'Dashboard overview fetched');
});

export const getAttendance = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const studentId = req.user?.id;
  if (!studentId) { sendError(res, 401, 'Authentication required'); return; }
  const month = req.query.month ? parseInt(req.query.month as string) : undefined;
  const year = req.query.year ? parseInt(req.query.year as string) : undefined;
  const data = await studentDashboardService.getAttendance(studentId, month, year);
  sendSuccess(res, data, 'Attendance fetched');
});

export const getTimetable = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const studentId = req.user?.id;
  if (!studentId) { sendError(res, 401, 'Authentication required'); return; }
  const data = await studentDashboardService.getTimetable(studentId);
  sendSuccess(res, data, 'Timetable fetched');
});

export const getAssignments = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const studentId = req.user?.id;
  if (!studentId) { sendError(res, 401, 'Authentication required'); return; }
  const data = await studentDashboardService.getAssignments(studentId);
  sendSuccess(res, data, 'Assignments fetched');
});

export const getMarks = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const studentId = req.user?.id;
  if (!studentId) { sendError(res, 401, 'Authentication required'); return; }
  const data = await studentDashboardService.getMarks(studentId);
  sendSuccess(res, data, 'Marks fetched');
});

export const getMaterials = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const studentId = req.user?.id;
  if (!studentId) { sendError(res, 401, 'Authentication required'); return; }
  const data = await studentDashboardService.getMaterials(studentId);
  sendSuccess(res, data, 'Study materials fetched');
});

export const getFees = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const studentId = req.user?.id;
  if (!studentId) { sendError(res, 401, 'Authentication required'); return; }
  const data = await studentDashboardService.getFees(studentId);
  sendSuccess(res, data, 'Fees fetched');
});

export const getNotifications = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const studentId = req.user?.id;
  if (!studentId) { sendError(res, 401, 'Authentication required'); return; }
  const data = await studentDashboardService.getNotifications(studentId);
  sendSuccess(res, data, 'Notifications fetched');
});

export const markRead = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const studentId = req.user?.id;
  if (!studentId) { sendError(res, 401, 'Authentication required'); return; }
  const result = await studentDashboardService.markNotificationRead(req.params.id, studentId);
  sendSuccess(res, result, 'Notification marked as read');
});

export const getCertificates = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const studentId = req.user?.id;
  if (!studentId) { sendError(res, 401, 'Authentication required'); return; }
  const data = await studentDashboardService.getCertificates(studentId);
  sendSuccess(res, data, 'Certificates fetched');
});
