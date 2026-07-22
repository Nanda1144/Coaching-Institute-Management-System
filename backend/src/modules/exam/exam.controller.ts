import { Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { sendSuccess, sendCreated } from '../../shared/utils/api-response';
import { AppError } from '../../shared/errors/AppError';
import { examService } from './exam.service';

export const examController = {
  getAll: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const exams = await examService.getAll(req.query as any);
    sendSuccess(res, exams, 'Exams retrieved successfully');
  }),

  getById: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const exam = await examService.getById(req.params.id);
    if (!exam) throw AppError.notFound('Exam not found');
    sendSuccess(res, exam, 'Exam retrieved successfully');
  }),

  create: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const exam = await examService.create(req.body);
    sendCreated(res, exam, 'Exam created successfully');
  }),

  update: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const exam = await examService.update(req.params.id, req.body);
    if (!exam) throw AppError.notFound('Exam not found');
    sendSuccess(res, exam, 'Exam updated successfully');
  }),

  delete: asyncHandler(async (req: IAuthRequest, res: Response) => {
    await examService.delete(req.params.id, req.user?.id);
    sendSuccess(res, null, 'Exam deleted successfully');
  }),
};
