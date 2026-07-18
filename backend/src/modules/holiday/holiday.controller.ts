import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { sendCreated, sendSuccess } from '../../shared/utils/api-response';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { holidayService } from './holiday.service';

export const holidayController = {
  create: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const result = await holidayService.create(req.body, req.user!.id);
    sendCreated(res, result, 'Holiday created successfully');
  }),

  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, holidayType, academicYear } = req.query as any;
    const result = await holidayService.findAll({
      page: +page || 1,
      limit: +limit || 10,
      holidayType,
      academicYear,
    });
    sendSuccess(res, result, 'Holidays retrieved successfully');
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await holidayService.findById(id);
    sendSuccess(res, result, 'Holiday retrieved successfully');
  }),

  update: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { id } = req.params;
    const result = await holidayService.update(id, req.body, req.user!.id);
    sendSuccess(res, result, 'Holiday updated successfully');
  }),

  delete: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { id } = req.params;
    const result = await holidayService.delete(id, req.user!.id);
    sendSuccess(res, result, 'Holiday deleted successfully');
  }),

  getUpcoming: asyncHandler(async (req: Request, res: Response) => {
    const days = parseInt(req.params.days, 10) || 30;
    const result = await holidayService.getUpcoming(days);
    sendSuccess(res, result, 'Upcoming holidays retrieved successfully');
  }),

  getStats: asyncHandler(async (_req: Request, res: Response) => {
    const result = await holidayService.getStats();
    sendSuccess(res, result, 'Holiday stats fetched successfully');
  }),

  getSpecialEvents: asyncHandler(async (_req: Request, res: Response) => {
    const result = await holidayService.getSpecialEvents();
    sendSuccess(res, result, 'Special events fetched successfully');
  }),
};
