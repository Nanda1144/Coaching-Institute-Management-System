import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { sendSuccess, sendCreated } from '../../shared/utils/api-response';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { settingsService } from './settings.service';

export const settingsController = {
  getAll: asyncHandler(async (_req: Request, res: Response) => {
    const result = await settingsService.getAll();
    sendSuccess(res, result, 'Settings retrieved successfully');
  }),

  getSection: asyncHandler(async (req: Request, res: Response) => {
    const { section } = req.params;
    const result = await settingsService.getSection(section);
    sendSuccess(res, result, 'Settings retrieved successfully');
  }),

  upsert: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { section } = req.params;
    const result = await settingsService.upsert(section, req.body, req.user!.id);
    sendCreated(res, result, 'Settings updated successfully');
  }),
};
