import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { sendSuccess, sendCreated } from '../../shared/utils/api-response';
import { AppError } from '../../shared/errors/AppError';
import { studentService } from './student.service';

export const studentController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const students = await studentService.getAll(req.query as any);
    sendSuccess(res, students, 'Students retrieved successfully');
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const student = await studentService.getById(req.params.id);
    if (!student) throw AppError.notFound('Student not found');
    sendSuccess(res, student, 'Student retrieved successfully');
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const student = await studentService.create(req.body);
    sendCreated(res, student, 'Student created successfully');
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const student = await studentService.update(req.params.id, req.body);
    if (!student) throw AppError.notFound('Student not found');
    sendSuccess(res, student, 'Student updated successfully');
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await studentService.delete(req.params.id);
    sendSuccess(res, null, 'Student deleted successfully');
  }),
};
