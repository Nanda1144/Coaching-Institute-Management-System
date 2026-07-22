import { Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { sendSuccess, sendCreated } from '../../shared/utils/api-response';
import { AppError } from '../../shared/errors/AppError';
import { revaluationService } from './revaluation.service';

export const revaluationController = {
  getAll: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await revaluationService.getAll(req.query as any);
    sendSuccess(res, data, 'Revaluation requests retrieved');
  }),

  getById: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await revaluationService.getById(req.params.id);
    if (!data) throw AppError.notFound('Revaluation request not found');
    sendSuccess(res, data, 'Revaluation request retrieved');
  }),

  create: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await revaluationService.create(req.body);
    await revaluationService.addTimelineEntry(data.id, 'created', 'Revaluation request submitted', req.user?.id);
    sendCreated(res, data, 'Revaluation request submitted');
  }),

  updateStatus: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await revaluationService.updateStatus(req.params.id, { ...req.body, reviewedById: req.user?.id });
    if (!data) throw AppError.notFound('Revaluation request not found');
    await revaluationService.addTimelineEntry(req.params.id, `status_${req.body.status}`, req.body.remarks, req.user?.id);
    sendSuccess(res, data, 'Revaluation status updated');
  }),

  getTimeline: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await revaluationService.getTimeline(req.params.id);
    sendSuccess(res, data, 'Timeline retrieved');
  }),
};
