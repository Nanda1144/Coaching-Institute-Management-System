import { Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { sendSuccess, sendCreated } from '../../shared/utils/api-response';
import { timetableService } from './timetable.service';
import type { IAuthRequest } from '../../shared/middleware/auth.middleware';
import type { CreateTimetableInput, UpdateTimetableInput } from './timetable.validator';

export const getAll = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const result = await timetableService.findAll(req.query as any);
  sendSuccess(res, result, 'Timetables fetched successfully');
});

export const getByFaculty = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { facultyId } = req.params;
  const result = await timetableService.findByFaculty(facultyId);
  sendSuccess(res, result, 'Timetables fetched by faculty successfully');
});

export const getByDay = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { facultyId, dayOfWeek } = req.params;
  const result = await timetableService.findByDay(facultyId, dayOfWeek);
  sendSuccess(res, result, 'Timetables fetched by day successfully');
});

export const getById = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  const result = await timetableService.findById(id);
  sendSuccess(res, result, 'Timetable fetched successfully');
});

export const create = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const result = await timetableService.create(req.body as CreateTimetableInput, req.user!.id);
  sendCreated(res, result, 'Timetable created successfully');
});

export const update = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  const result = await timetableService.update(id, req.body as UpdateTimetableInput, req.user!.id);
  sendSuccess(res, result, 'Timetable updated successfully');
});

export const deleteTimetable = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  await timetableService.delete(id, req.user!.id);
  sendSuccess(res, null, 'Timetable deleted successfully');
});
