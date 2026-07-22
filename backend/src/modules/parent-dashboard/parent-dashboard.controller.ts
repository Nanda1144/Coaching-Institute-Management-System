import { Response, NextFunction } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { sendSuccess, sendError } from '../../shared/utils/api-response';
import { parentDashboardService } from './parent-dashboard.service';

export const getOverview = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const parentId = req.user?.id;
  if (!parentId) { sendError(res, 401, 'Authentication required'); return; }
  const data = await parentDashboardService.getOverview(parentId);
  sendSuccess(res, data, 'Dashboard overview fetched');
});

export const getAttendance = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const parentId = req.user?.id;
  if (!parentId) { sendError(res, 401, 'Authentication required'); return; }
  const month = req.query.month ? parseInt(req.query.month as string) : undefined;
  const year = req.query.year ? parseInt(req.query.year as string) : undefined;
  const data = await parentDashboardService.getAttendance(parentId, month, year);
  sendSuccess(res, data, 'Attendance fetched');
});

export const getTimetable = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const parentId = req.user?.id;
  if (!parentId) { sendError(res, 401, 'Authentication required'); return; }
  const data = await parentDashboardService.getTimetable(parentId);
  sendSuccess(res, data, 'Timetable fetched');
});

export const getAssignments = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const parentId = req.user?.id;
  if (!parentId) { sendError(res, 401, 'Authentication required'); return; }
  const data = await parentDashboardService.getAssignments(parentId);
  sendSuccess(res, data, 'Assignments fetched');
});

export const getMarks = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const parentId = req.user?.id;
  if (!parentId) { sendError(res, 401, 'Authentication required'); return; }
  const data = await parentDashboardService.getMarks(parentId);
  sendSuccess(res, data, 'Marks fetched');
});

export const getMaterials = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const parentId = req.user?.id;
  if (!parentId) { sendError(res, 401, 'Authentication required'); return; }
  const data = await parentDashboardService.getMaterials(parentId);
  sendSuccess(res, data, 'Study materials fetched');
});

export const getFees = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const parentId = req.user?.id;
  if (!parentId) { sendError(res, 401, 'Authentication required'); return; }
  const data = await parentDashboardService.getFees(parentId);
  sendSuccess(res, data, 'Fees fetched');
});

export const getNotifications = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const parentId = req.user?.id;
  if (!parentId) { sendError(res, 401, 'Authentication required'); return; }
  const data = await parentDashboardService.getNotifications(parentId);
  sendSuccess(res, data, 'Notifications fetched');
});

export const updateProfile = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const parentId = req.user?.id;
  if (!parentId) { sendError(res, 401, 'Authentication required'); return; }
  const data = await parentDashboardService.updateProfile(parentId, req.body);
  sendSuccess(res, data, 'Profile updated successfully');
});

export const changePassword = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const parentId = req.user?.id;
  if (!parentId) { sendError(res, 401, 'Authentication required'); return; }
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) { sendError(res, 400, 'Current password and new password are required'); return; }
  if (newPassword.length < 8) { sendError(res, 400, 'New password must be at least 8 characters'); return; }
  const data = await parentDashboardService.changePassword(parentId, currentPassword, newPassword);
  sendSuccess(res, data, 'Password changed successfully');
});
