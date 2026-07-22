import { Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { sendSuccess, sendCreated } from '../../shared/utils/api-response';
import { studentRegistrationService } from './student-registration.service';
import { StudentRegistrationInput } from './student-registration.validator';

export const register = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const data = req.body as StudentRegistrationInput;
  const request = await studentRegistrationService.create(data);
  sendCreated(res, request, 'Registration request submitted successfully. Awaiting faculty approval.');
});

export const getAll = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const requests = await studentRegistrationService.getAll(req.query as any);
  sendSuccess(res, requests, 'Registration requests retrieved successfully');
});

export const review = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { status, remarks, batchId, batch, joiningDate } = req.body;
  const request = await studentRegistrationService.review(req.params.id, status, remarks, req.user?.id, { batchId, batch, joiningDate });
  sendSuccess(res, request, `Registration request ${status.toLowerCase()} successfully`);
});
