import { Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { sendSuccess, sendCreated } from '../../shared/utils/api-response';
import { AppError } from '../../shared/errors/AppError';
import { parentService } from './parent.service';

export const parentController = {
  getAll: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const parents = await parentService.getAll(req.query as any);
    sendSuccess(res, parents, 'Parents retrieved');
  }),

  getById: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const parent = await parentService.getById(req.params.id);
    if (!parent) throw AppError.notFound('Parent not found');
    sendSuccess(res, parent, 'Parent retrieved');
  }),

  create: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const parent = await parentService.create(req.body);
    sendCreated(res, parent, 'Parent created');
  }),

  update: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const parent = await parentService.update(req.params.id, req.body);
    if (!parent) throw AppError.notFound('Parent not found');
    sendSuccess(res, parent, 'Parent updated');
  }),

  delete: asyncHandler(async (req: IAuthRequest, res: Response) => {
    await parentService.delete(req.params.id);
    sendSuccess(res, null, 'Parent deleted');
  }),

  // =========== Linking ===========
  getLinkedStudents: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const students = await parentService.getLinkedStudents(req.params.id);
    sendSuccess(res, students, 'Linked students retrieved');
  }),

  linkStudent: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { studentId, relationship } = req.body;
    await parentService.linkStudent(req.params.id, studentId, relationship);
    sendSuccess(res, null, 'Student linked to parent');
  }),

  unlinkStudent: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { studentId } = req.params;
    await parentService.unlinkStudent(req.params.id, studentId);
    sendSuccess(res, null, 'Student unlinked from parent');
  }),

  getParentsByStudent: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const parents = await parentService.getParentsByStudent(req.params.studentId);
    sendSuccess(res, parents, 'Parents retrieved for student');
  }),

  // =========== Notification Preferences ===========
  updateNotificationPrefs: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const parent = await parentService.updateNotificationPrefs(req.params.id, req.body);
    if (!parent) throw AppError.notFound('Parent not found');
    sendSuccess(res, parent, 'Notification preferences updated');
  }),

  // =========== Dashboard ===========
  getDashboard: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const dashboard = await parentService.getDashboard(req.params.id);
    if (!dashboard) throw AppError.notFound('Parent not found');
    sendSuccess(res, dashboard, 'Dashboard retrieved');
  }),
};
