import { Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { sendSuccess, sendCreated, sendError } from '../../shared/utils/api-response';
import { AppError } from '../../shared/errors/AppError';
import { certificateService } from './certificate.service';

export const certificateController = {
  getAll: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await certificateService.getAll(req.query as any);
    sendSuccess(res, data, 'Certificates retrieved successfully');
  }),

  getById: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await certificateService.getById(req.params.id);
    if (!data) throw AppError.notFound('Certificate not found');
    sendSuccess(res, data, 'Certificate retrieved successfully');
  }),

  getPreview: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await certificateService.getPreview(req.params.id);
    if (!data) throw AppError.notFound('Certificate not found');
    sendSuccess(res, data, 'Certificate preview retrieved');
  }),

  getPlaceholders: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await certificateService.getPlaceholders(req.params.id);
    sendSuccess(res, data, 'Placeholders retrieved');
  }),

  download: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const format = (req.query.format as string) || 'pdf';
    const buffer = await certificateService.generateDownload(req.params.id, format);
    if (!buffer) throw AppError.notFound('Certificate not found');
    res.setHeader('Content-Type', format === 'pdf' ? 'application/pdf' : 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename=certificate-${req.params.id}.${format}`);
    res.send(buffer);
  }),

  create: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await certificateService.create(req.body);
    sendCreated(res, data, 'Certificate created successfully');
  }),

  update: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await certificateService.update(req.params.id, req.body);
    if (!data) throw AppError.notFound('Certificate not found');
    sendSuccess(res, data, 'Certificate updated successfully');
  }),

  updatePlaceholders: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await certificateService.updatePlaceholders(req.params.id, req.body.placeholders);
    sendSuccess(res, data, 'Placeholders updated');
  }),

  delete: asyncHandler(async (req: IAuthRequest, res: Response) => {
    await certificateService.delete(req.params.id);
    sendSuccess(res, null, 'Certificate deleted successfully');
  }),
};
