import { Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { sendSuccess, sendCreated } from '../../shared/utils/api-response';
import { AppError } from '../../shared/errors/AppError';
import { enrollmentService } from './enrollment.service';

export const enrollmentController = {
  getAll: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await enrollmentService.getAll(req.query as any);
    sendSuccess(res, data, 'Enrollments retrieved');
  }),

  getById: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await enrollmentService.getById(req.params.id);
    if (!data) throw AppError.notFound('Enrollment not found');
    sendSuccess(res, data, 'Enrollment retrieved');
  }),

  create: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await enrollmentService.create(req.body);
    sendCreated(res, data, 'Enrolled successfully');
  }),

  delete: asyncHandler(async (req: IAuthRequest, res: Response) => {
    await enrollmentService.delete(req.params.id);
    sendSuccess(res, null, 'Enrollment removed');
  }),

  updateStatus: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await enrollmentService.updateStatus(req.params.id, req.body.status);
    if (!data) throw AppError.notFound('Enrollment not found');
    sendSuccess(res, data, 'Enrollment status updated');
  }),
};
