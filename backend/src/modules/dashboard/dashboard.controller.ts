import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { sendSuccess } from '../../shared/utils/api-response';
import { AppError } from '../../shared/errors/AppError';
import { dashboardService } from './dashboard.service';

export const dashboardController = {
  getAdminStats: asyncHandler(async (_req: Request, res: Response) => {
    const stats = await dashboardService.getAdminStats();
    sendSuccess(res, stats, 'Admin dashboard stats retrieved successfully');
  }),

  getFacultyStats: asyncHandler(async (req: Request, res: Response) => {
    const { facultyId } = req.params;
    const stats = await dashboardService.getFacultyStats(facultyId);
    if (!stats) {
      throw AppError.notFound('Faculty not found');
    }
    sendSuccess(res, stats, 'Faculty dashboard stats retrieved successfully');
  }),

  getRecentActivities: asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const logs = await dashboardService.getRecentActivities(limit);
    sendSuccess(res, logs, 'Recent activities retrieved successfully');
  }),
};
