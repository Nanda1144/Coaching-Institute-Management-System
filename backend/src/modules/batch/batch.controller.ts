import { Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { sendSuccess, sendCreated } from '../../shared/utils/api-response';
import { AppError } from '../../shared/errors/AppError';
import { batchService } from './batch.service';

export const batchController = {
  getAll: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await batchService.getAll(req.query as any);
    sendSuccess(res, data, 'Batches retrieved');
  }),

  getById: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await batchService.getById(req.params.id);
    if (!data) throw AppError.notFound('Batch not found');
    sendSuccess(res, data, 'Batch retrieved');
  }),

  create: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await batchService.create(req.body);
    sendCreated(res, data, 'Batch created');
  }),

  update: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await batchService.update(req.params.id, req.body);
    if (!data) throw AppError.notFound('Batch not found');
    sendSuccess(res, data, 'Batch updated');
  }),

  delete: asyncHandler(async (req: IAuthRequest, res: Response) => {
    await batchService.delete(req.params.id);
    sendSuccess(res, null, 'Batch deleted');
  }),

  allocateStudent: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await batchService.allocateStudent(req.params.batchId, req.body.studentId);
    sendCreated(res, data, 'Student allocated');
  }),

  deallocateStudent: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await batchService.deallocateStudent(req.params.batchId, req.params.studentId);
    sendSuccess(res, data, 'Student deallocated');
  }),

  getBatchStudents: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await batchService.getBatchStudents(req.params.batchId);
    sendSuccess(res, data, 'Batch students retrieved');
  }),

  assignFaculty: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await batchService.assignFaculty(req.params.batchId, req.body.facultyId);
    sendSuccess(res, data, 'Faculty assigned');
  }),

  removeFaculty: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await batchService.removeFaculty(req.params.batchId);
    sendSuccess(res, data, 'Faculty removed');
  }),

  getBatchFaculty: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await batchService.getBatchFaculty(req.params.batchId);
    sendSuccess(res, data, 'Batch faculty retrieved');
  }),

  transferStudent: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { studentId, oldBatchId, newBatchId, reason } = req.body;
    const data = await batchService.transferStudent(studentId, oldBatchId, newBatchId, reason);
    sendCreated(res, data, 'Student transferred');
  }),

  getTransferHistory: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await batchService.getTransferHistory(req.params.studentId);
    sendSuccess(res, data, 'Transfer history retrieved');
  }),

  getCapacity: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await batchService.getCapacity(req.params.id);
    sendSuccess(res, data, 'Capacity retrieved');
  }),

  validateCapacity: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await batchService.validateCapacity(req.params.id, req.body.count);
    sendSuccess(res, data, 'Capacity validation completed');
  }),

  getAnalytics: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await batchService.getAnalytics(req.params.id);
    sendSuccess(res, data, 'Batch analytics retrieved');
  }),
};
