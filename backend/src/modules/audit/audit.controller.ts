import { Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { sendSuccess, sendCreated } from '../../shared/utils/api-response';
import { AppError } from '../../shared/errors/AppError';
import { auditService } from './audit.service';

export const auditController = {
  getAll: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await auditService.getAll(req.query as any);
    sendSuccess(res, data, 'Audit logs retrieved successfully');
  }),

  getById: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await auditService.getById(req.params.id);
    if (!data) throw AppError.notFound('Audit log not found');
    sendSuccess(res, data, 'Audit log retrieved successfully');
  }),

  create: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await auditService.create(req.body);
    sendCreated(res, data, 'Audit log created successfully');
  }),

  getSummary: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await auditService.getSummary(req.query as any);
    sendSuccess(res, data, 'Audit summary retrieved successfully');
  }),

  getUserActivity: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await auditService.getUserActivity(req.params.userId, req.query as any);
    sendSuccess(res, data, 'User activity retrieved successfully');
  }),
};
