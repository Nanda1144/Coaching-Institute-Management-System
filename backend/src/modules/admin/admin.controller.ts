import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { sendSuccess } from '../../shared/utils/api-response';
import type { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { adminService } from './admin.service';

export const adminController = {
  listUsers: asyncHandler(async (_req: Request, res: Response) => {
    const users = await adminService.listUsers();
    sendSuccess(res, users, 'Users retrieved successfully');
  }),

  updatePermissions: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { id } = req.params;
    const { permissions } = req.body;
    const updated = await adminService.updatePermissions(id, permissions);
    sendSuccess(res, updated, 'Permissions updated successfully');
  }),
};
