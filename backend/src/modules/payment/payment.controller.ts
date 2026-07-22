import { Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { sendSuccess, sendCreated } from '../../shared/utils/api-response';
import { AppError } from '../../shared/errors/AppError';
import { paymentService } from './payment.service';

export const paymentController = {
  getAll: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await paymentService.getAll(req.query as any);
    sendSuccess(res, data, 'Payments retrieved successfully');
  }),

  getById: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await paymentService.getById(req.params.id);
    if (!data) throw AppError.notFound('Payment not found');
    sendSuccess(res, data, 'Payment retrieved successfully');
  }),

  getByStudent: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await paymentService.getByStudent(req.params.studentId, req.query as any);
    sendSuccess(res, data, 'Student payments retrieved successfully');
  }),

  getHistory: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await paymentService.getHistory(req.query as any);
    sendSuccess(res, data, 'Payment history retrieved successfully');
  }),

  getSummary: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await paymentService.getSummary(req.query as any);
    sendSuccess(res, data, 'Payment summary retrieved successfully');
  }),

  create: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await paymentService.create(req.body);
    sendCreated(res, data, 'Payment recorded successfully');
  }),

  update: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await paymentService.update(req.params.id, req.body);
    if (!data) throw AppError.notFound('Payment not found');
    sendSuccess(res, data, 'Payment updated successfully');
  }),

  delete: asyncHandler(async (req: IAuthRequest, res: Response) => {
    await paymentService.delete(req.params.id);
    sendSuccess(res, null, 'Payment deleted successfully');
  }),

  processRefund: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await paymentService.processRefund(req.params.id, req.body, req.user?.id);
    sendSuccess(res, data, 'Refund processed successfully');
  }),
};
