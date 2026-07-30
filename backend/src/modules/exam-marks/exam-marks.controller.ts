import { Response } from 'express';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { sendSuccess, sendCreated } from '../../shared/utils/api-response';
import { examMarksService } from './exam-marks.service';

export const examMarksController = {
  getMarks: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const marks = await examMarksService.getMarks(req.params.examId);
    sendSuccess(res, marks, 'Exam marks retrieved');
  }),

  uploadMarks: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const marks = await examMarksService.uploadMarks(req.params.examId, req.body.marks, req.user!.id);
    sendCreated(res, marks, 'Exam marks uploaded successfully');
  }),
};
