import { Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { sendSuccess } from '../../shared/utils/api-response';
import { AppError } from '../../shared/errors/AppError';
import { referencesService } from './references.service';

export const getDepartments = asyncHandler(async (_req: IAuthRequest, res: Response) => {
  const data = await referencesService.getDepartments();
  sendSuccess(res, data, 'Departments fetched');
});

export const createDepartment = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { name, code } = req.body;
  if (!name || !code) throw AppError.badRequest('Name and code are required');
  const data = await referencesService.createDepartment({ name, code });
  sendSuccess(res, data, 'Department created', 201);
});

export const updateDepartment = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  const data = await referencesService.updateDepartment(id, req.body);
  if (!data) throw AppError.notFound('Department not found');
  sendSuccess(res, data, 'Department updated');
});

export const deleteDepartment = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  await referencesService.deleteDepartment(id);
  sendSuccess(res, null, 'Department deleted');
});

export const getCourses = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const department = req.query.department as string | undefined;
  const data = await referencesService.getCourses(department);
  sendSuccess(res, data, 'Courses fetched');
});

export const createCourse = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { name, code, duration } = req.body;
  if (!name || !code) throw AppError.badRequest('Name and code are required');
  const data = await referencesService.createCourse({ name, code, duration: duration ? Number(duration) : undefined });
  sendSuccess(res, data, 'Course created', 201);
});

export const updateCourse = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  const data = await referencesService.updateCourse(id, req.body);
  if (!data) throw AppError.notFound('Course not found');
  sendSuccess(res, data, 'Course updated');
});

export const deleteCourse = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  await referencesService.deleteCourse(id);
  sendSuccess(res, null, 'Course deleted');
});

export const getBatches = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const department = req.query.department as string | undefined;
  const course = req.query.course as string | undefined;
  const semester = req.query.semester ? parseInt(req.query.semester as string) : undefined;
  const data = await referencesService.getBatches(department, course, semester);
  sendSuccess(res, data, 'Batches fetched');
});

export const getFaculty = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const department = req.query.department as string | undefined;
  const data = await referencesService.getFaculty(department);
  sendSuccess(res, data, 'Faculty fetched');
});
