import { Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { sendSuccess, sendCreated } from '../../shared/utils/api-response';
import { AppError } from '../../shared/errors/AppError';
import { admissionService } from './admission.service';

export const admissionController = {
  getAll: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await admissionService.getAll(req.query as any);
    sendSuccess(res, data, 'Admissions retrieved successfully');
  }),

  getById: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await admissionService.getById(req.params.id);
    if (!data) throw AppError.notFound('Admission not found');
    sendSuccess(res, data, 'Admission retrieved successfully');
  }),

  create: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await admissionService.create(req.body);
    sendCreated(res, data, 'Admission created successfully');
  }),

  update: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await admissionService.update(req.params.id, req.body);
    if (!data) throw AppError.notFound('Admission not found');
    sendSuccess(res, data, 'Admission updated successfully');
  }),

  delete: asyncHandler(async (req: IAuthRequest, res: Response) => {
    await admissionService.delete(req.params.id);
    sendSuccess(res, null, 'Admission deleted successfully');
  }),

  checkEligibility: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { courseId, dateOfBirth, qualification } = req.body;
    const data = await admissionService.checkEligibility(courseId, dateOfBirth, qualification);
    sendSuccess(res, data, 'Eligibility check completed');
  }),

  enroll: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await admissionService.enroll(req.body);
    sendCreated(res, data, 'Enrolled successfully');
  }),

  getBatchCapacity: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await admissionService.getBatchCapacity(req.params.batchId);
    sendSuccess(res, data, 'Batch capacity retrieved');
  }),

  enrollInBatch: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await admissionService.enrollInBatch(req.params.batchId, req.body);
    sendCreated(res, data, 'Enrolled in batch successfully');
  }),
};
