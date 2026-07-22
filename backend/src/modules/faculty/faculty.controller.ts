import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { sendSuccess, sendCreated } from '../../shared/utils/api-response';
import type { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { facultyService } from './faculty.service';

export const facultyController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const result = await facultyService.findAll(req.query as any);
    sendSuccess(res, result, 'Faculty retrieved successfully');
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const faculty = await facultyService.findById(id);
    sendSuccess(res, faculty, 'Faculty retrieved successfully');
  }),

  create: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const faculty = await facultyService.create(req.body, req.user!.id);
    return sendCreated(res, faculty, 'Faculty created successfully');
  }),

  update: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { id } = req.params;
    const faculty = await facultyService.update(id, req.body, req.user!.id);
    sendSuccess(res, faculty, 'Faculty updated successfully');
  }),

  delete: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { id } = req.params;
    const result = await facultyService.delete(id, req.user!.id);
    sendSuccess(res, result, 'Faculty deleted successfully');
  }),

  getProfile: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const profile = await facultyService.getProfile(req.user!.id);
    sendSuccess(res, profile, 'Profile retrieved successfully');
  }),

  getDashboardStats: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const stats = await facultyService.getDashboardStats(req.user!.id);
    sendSuccess(res, stats, 'Dashboard stats retrieved successfully');
  }),
};
