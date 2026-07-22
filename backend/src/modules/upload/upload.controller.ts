import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { sendCreated, sendSuccess, sendError } from '../../shared/utils/api-response';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { uploadService } from './upload.service';

export const uploadController = {
  uploadFile: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const file = req.file;
    if (!file) {
      sendError(res, 400, 'No file provided');
      return;
    }

    const { module, moduleId } = req.body;
    const result = await uploadService.uploadFile(
      file,
      req.user!.id,
      req.user!.role,
      module,
      moduleId
    );
    sendCreated(res, result, 'File uploaded successfully');
  }),

  uploadPublic: asyncHandler(async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
      sendError(res, 400, 'No file provided');
      return;
    }

    const result = await uploadService.uploadFile(
      file,
      'public',
      'PUBLIC',
      req.body.module || 'public',
      req.body.moduleId || null
    );
    sendCreated(res, result, 'File uploaded successfully');
  }),

  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.query as any;
    const result = await uploadService.findAll({ page: +page || 1, limit: +limit || 10 });
    sendSuccess(res, result, 'Uploads retrieved successfully');
  }),

  delete: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { id } = req.params;
    const result = await uploadService.delete(id, req.user!.id);
    sendSuccess(res, result, 'Upload deleted successfully');
  }),
};
