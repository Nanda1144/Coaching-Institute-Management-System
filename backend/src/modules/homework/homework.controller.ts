
import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { sendSuccess, sendCreated } from '../../shared/utils/api-response';
import type { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { homeworkService } from './homework.service';

export const homeworkController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const result = await homeworkService.findAll(req.query as any);
    sendSuccess(res, result, 'Homeworks retrieved successfully');
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const homework = await homeworkService.findById(id);
    sendSuccess(res, homework, 'Homework retrieved successfully');
  }),

  create: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const homework = await homeworkService.create(req.body, req.user!.id);
    return sendCreated(res, homework, 'Homework created successfully');
  }),

  update: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { id } = req.params;
    const homework = await homeworkService.update(id, req.body, req.user!.id);
    sendSuccess(res, homework, 'Homework updated successfully');
  }),

  delete: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { id } = req.params;
    const result = await homeworkService.delete(id, req.user!.id);
    sendSuccess(res, result, 'Homework deleted successfully');
  }),

  getByFaculty: asyncHandler(async (req: Request, res: Response) => {
    const { facultyId } = req.params;
    const homeworks = await homeworkService.getByFaculty(facultyId);
    sendSuccess(res, homeworks, 'Homeworks retrieved successfully');
  }),
};
