import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { sendSuccess } from '../../shared/utils/api-response';
import { AppError } from '../../shared/errors/AppError';
import { dashboardService } from './dashboard.service';

export const dashboardController = {
  getAdminStats: asyncHandler(async (_req: Request, res: Response) => {
    const stats = await dashboardService.getAdminStats();
    sendSuccess(res, stats, 'Admin dashboard stats retrieved successfully');
  }),

  getFacultyStats: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { facultyId } = req.params;
    if ((req.user?.role === 'FACULTY' || req.user?.role === 'HOD') && req.user?.id !== facultyId && req.user?.facultyId !== facultyId) {
      throw AppError.forbidden('You can only access your own faculty data');
    }
    const stats = await dashboardService.getFacultyStats(facultyId);
    if (!stats) {
      throw AppError.notFound('Faculty not found');
    }
    sendSuccess(res, stats, 'Faculty dashboard stats retrieved successfully');
  }),

  getStudentStats: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { studentId } = req.params;
    if (req.user?.role === 'STUDENT' && req.user?.id !== studentId && req.user?.studentId !== studentId) {
      throw AppError.forbidden('You can only access your own student data');
    }
    const stats = await dashboardService.getStudentStats(studentId);
    if (!stats) throw AppError.notFound('Student not found');
    sendSuccess(res, stats, 'Student dashboard stats retrieved successfully');
  }),

  getParentStats: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { parentId } = req.params;
    if (req.user?.role === 'PARENT' && req.user?.id !== parentId) {
      throw AppError.forbidden('You can only access your own parent data');
    }
    const stats = await dashboardService.getParentStats(parentId);
    if (!stats) throw AppError.notFound('Parent not found');
    sendSuccess(res, stats, 'Parent dashboard stats retrieved successfully');
  }),

  getRecentActivities: asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const logs = await dashboardService.getRecentActivities(limit);
    sendSuccess(res, logs, 'Recent activities retrieved successfully');
  }),
};
