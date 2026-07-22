import { Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { sendSuccess, sendCreated } from '../../shared/utils/api-response';
import { AppError } from '../../shared/errors/AppError';
import { branchService } from './branch.service';

export const branchController = {
  getAll: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await branchService.getAll(req.query as any);
    sendSuccess(res, data, 'Branches retrieved successfully');
  }),

  getList: asyncHandler(async (_req: IAuthRequest, res: Response) => {
    const data = await branchService.getList();
    sendSuccess(res, data, 'Branch list retrieved');
  }),

  getById: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await branchService.getById(req.params.id);
    if (!data) throw AppError.notFound('Branch not found');
    sendSuccess(res, data, 'Branch retrieved successfully');
  }),

  create: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await branchService.create(req.body);
    sendCreated(res, data, 'Branch created successfully');
  }),

  update: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await branchService.update(req.params.id, req.body);
    if (!data) throw AppError.notFound('Branch not found');
    sendSuccess(res, data, 'Branch updated successfully');
  }),

  delete: asyncHandler(async (req: IAuthRequest, res: Response) => {
    await branchService.delete(req.params.id);
    sendSuccess(res, null, 'Branch deleted successfully');
  }),

  toggleStatus: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await branchService.toggleStatus(req.params.id, req.body.status);
    if (!data) throw AppError.notFound('Branch not found');
    sendSuccess(res, data, 'Branch status updated');
  }),

  getAnalyticsSummary: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await branchService.getAnalyticsSummary(req.query as any);
    sendSuccess(res, data, 'Analytics summary retrieved');
  }),

  getAdmissionsTrend: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await branchService.getAdmissionsTrend(req.query as any);
    sendSuccess(res, data, 'Admissions trend retrieved');
  }),

  getRevenueTrend: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await branchService.getRevenueTrend(req.query as any);
    sendSuccess(res, data, 'Revenue trend retrieved');
  }),

  getAttendanceTrend: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await branchService.getAttendanceTrend(req.query as any);
    sendSuccess(res, data, 'Attendance trend retrieved');
  }),
};
