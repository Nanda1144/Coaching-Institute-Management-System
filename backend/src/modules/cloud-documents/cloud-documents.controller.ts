import { Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { sendSuccess, sendCreated } from '../../shared/utils/api-response';
import { AppError } from '../../shared/errors/AppError';
import { cloudDocumentsService } from './cloud-documents.service';

export const cloudDocumentsController = {
  getAll: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await cloudDocumentsService.getAll(req.query as any);
    sendSuccess(res, data, 'Cloud documents retrieved');
  }),

  getById: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const doc = await cloudDocumentsService.getById(req.params.id);
    if (!doc) throw AppError.notFound('Cloud document not found');
    sendSuccess(res, doc, 'Cloud document retrieved');
  }),

  upload: asyncHandler(async (req: IAuthRequest, res: Response) => {
    if (!req.file) throw AppError.badRequest('No file provided');
    const { studentId, documentType } = req.body;
    const doc = await cloudDocumentsService.upload(req.file, studentId, documentType);
    sendCreated(res, doc, 'Document uploaded to cloud');
  }),

  delete: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const doc = await cloudDocumentsService.delete(req.params.id);
    if (!doc) throw AppError.notFound('Cloud document not found');
    sendSuccess(res, null, 'Cloud document deleted');
  }),

  getByStudent: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const docs = await cloudDocumentsService.getByStudent(req.params.studentId);
    sendSuccess(res, docs, 'Cloud documents retrieved for student');
  }),
};
