import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { sendCreated, sendSuccess } from '../../shared/utils/api-response';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { reminderService } from './reminder.service';

export const reminderController = {
  create: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const result = await reminderService.create(req.body, req.user!.id);
    sendCreated(res, result, 'Reminder created successfully');
  }),

  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, status, assignmentId } = req.query as any;
    const result = await reminderService.findAll({
      page: +page || 1,
      limit: +limit || 10,
      status,
      assignmentId,
    });
    sendSuccess(res, result, 'Reminders retrieved successfully');
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await reminderService.findById(id);
    sendSuccess(res, result, 'Reminder retrieved successfully');
  }),

  update: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { id } = req.params;
    const result = await reminderService.update(id, req.body, req.user!.id);
    sendSuccess(res, result, 'Reminder updated successfully');
  }),

  delete: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { id } = req.params;
    const result = await reminderService.delete(id, req.user!.id);
    sendSuccess(res, result, 'Reminder deleted successfully');
  }),

  markSent: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await reminderService.markSent(id);
    sendSuccess(res, result, 'Reminder marked as sent');
  }),

  getMyReminders: asyncHandler(async (req: Request, res: Response) => {
    const { facultyId } = req.params;
    const result = await reminderService.getMyReminders(facultyId);
    sendSuccess(res, result, 'Reminders retrieved successfully');
  }),
};
