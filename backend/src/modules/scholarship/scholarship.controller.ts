import { Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { sendSuccess, sendCreated } from '../../shared/utils/api-response';
import { AppError } from '../../shared/errors/AppError';
import { scholarshipService } from './scholarship.service';

export const scholarshipController = {
  getAll: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await scholarshipService.getAll(req.query as any);
    sendSuccess(res, data, 'Scholarships retrieved');
  }),

  getById: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await scholarshipService.getById(req.params.id);
    if (!data) throw AppError.notFound('Scholarship not found');
    sendSuccess(res, data, 'Scholarship retrieved');
  }),

  create: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await scholarshipService.create(req.body);
    sendCreated(res, data, 'Scholarship created');
  }),

  update: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await scholarshipService.update(req.params.id, req.body);
    if (!data) throw AppError.notFound('Scholarship not found');
    sendSuccess(res, data, 'Scholarship updated');
  }),

  delete: asyncHandler(async (req: IAuthRequest, res: Response) => {
    await scholarshipService.delete(req.params.id);
    sendSuccess(res, null, 'Scholarship deleted');
  }),
};
