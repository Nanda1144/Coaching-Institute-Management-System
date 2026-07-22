import { Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { sendSuccess, sendCreated } from '../../shared/utils/api-response';
import { assignmentService } from './assignment.service';
import type { IAuthRequest } from '../../shared/middleware/auth.middleware';

export const getAll = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const result = await assignmentService.findAll(req.query as any);
  sendSuccess(res, result, 'Assignments fetched successfully');
});

export const getById = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const assignment = await assignmentService.findById(req.params.id);
  sendSuccess(res, assignment, 'Assignment fetched successfully');
});

export const create = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const assignment = await assignmentService.create(req.body, req.user!.id);
  sendCreated(res, assignment, 'Assignment created successfully');
});

export const update = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const assignment = await assignmentService.update(req.params.id, req.body, req.user!.id);
  sendSuccess(res, assignment, 'Assignment updated successfully');
});

export const deleteAssignment = asyncHandler(async (req: IAuthRequest, res: Response) => {
  await assignmentService.delete(req.params.id, req.user!.id);
  sendSuccess(res, null, 'Assignment deleted successfully');
});

export const getByFaculty = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const assignments = await assignmentService.getByFaculty(req.params.facultyId);
  sendSuccess(res, assignments, 'Faculty assignments fetched successfully');
});
