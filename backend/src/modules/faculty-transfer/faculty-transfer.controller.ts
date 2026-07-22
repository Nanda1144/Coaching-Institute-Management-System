import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { sendCreated, sendSuccess } from '../../shared/utils/api-response';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { facultyTransferService } from './faculty-transfer.service';

export const facultyTransferController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, status, facultyId } = req.query as any;
    const result = await facultyTransferService.findAll({
      page: +page || 1,
      limit: +limit || 10,
      status,
      facultyId,
    });
    sendSuccess(res, result, 'Faculty transfers retrieved successfully');
  }),

  getByFaculty: asyncHandler(async (req: Request, res: Response) => {
    const { facultyId } = req.params;
    const result = await facultyTransferService.getByFaculty(facultyId);
    sendSuccess(res, result, 'Faculty transfers retrieved successfully');
  }),

  create: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const result = await facultyTransferService.create(req.body, req.user!.id);
    sendCreated(res, result, 'Faculty transfer created successfully');
  }),

  updateStatus: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const result = await facultyTransferService.updateStatus(id, status as any, req.user!.id);
    sendSuccess(res, result, 'Faculty transfer status updated successfully');
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await facultyTransferService.findById(id);
    sendSuccess(res, result, 'Faculty transfer retrieved successfully');
  }),
};
