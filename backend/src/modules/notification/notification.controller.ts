import { Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { sendSuccess, sendCreated } from '../../shared/utils/api-response';
import { AppError } from '../../shared/errors/AppError';
import { notificationService } from './notification.service';

export const notificationController = {
  getAll: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await notificationService.getAll(req.query as any);
    sendSuccess(res, data, 'Notifications retrieved successfully');
  }),

  getHistory: asyncHandler(async (_req: IAuthRequest, res: Response) => {
    const data = await notificationService.getHistory();
    sendSuccess(res, data, 'Notification history retrieved successfully');
  }),

  send: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const notification = await notificationService.send(req.body, req.user?.id);
    sendCreated(res, notification, 'Notification sent successfully');
  }),

  markRead: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await notificationService.markRead(req.params.id);
    if (!data) throw AppError.notFound('Notification not found');
    sendSuccess(res, data, 'Notification marked as read');
  }),

  remove: asyncHandler(async (req: IAuthRequest, res: Response) => {
    await notificationService.remove(req.params.id);
    sendSuccess(res, null, 'Notification deleted successfully');
  }),
};
