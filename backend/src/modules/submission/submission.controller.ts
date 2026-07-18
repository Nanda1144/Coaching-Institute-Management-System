import { Response, NextFunction } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { sendSuccess, sendCreated } from '../../shared/utils/api-response';
import { submissionService } from './submission.service';
import { SubmissionQueryInput, GradeSubmissionInput } from './submission.validator';
import { AppError } from '../../shared/errors/AppError';

export const getAll = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const query = req.query as unknown as SubmissionQueryInput;
  const result = await submissionService.findAll(query);
  sendSuccess(res, result, 'Submissions fetched successfully');
});

export const getById = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const { id } = req.params;
  const submission = await submissionService.findById(id);
  if (!submission) throw AppError.notFound('Submission not found');
  sendSuccess(res, submission, 'Submission fetched successfully');
});

export const create = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const submission = await submissionService.create(req.body, req.user!.id);
  sendCreated(res, submission, 'Submission created successfully');
});

export const update = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  const submission = await submissionService.update(id, req.body, req.user!.id);
  sendSuccess(res, submission, 'Submission updated successfully');
});

export const deleteSubmission = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  await submissionService.remove(id, req.user!.id);
  sendSuccess(res, null, 'Submission deleted successfully');
});

export const grade = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const { id } = req.params;
  const data = req.body as GradeSubmissionInput;
  const userId = req.user!.id;
  const result = await submissionService.grade(id, data, userId);
  sendSuccess(res, result, 'Submission graded successfully');
});

export const getByAssignment = asyncHandler(async (req: IAuthRequest, res: Response, _next: NextFunction) => {
  const { assignmentId } = req.params;
  const submissions = await submissionService.getByAssignment(assignmentId);
  sendSuccess(res, submissions, 'Submissions fetched successfully');
});
