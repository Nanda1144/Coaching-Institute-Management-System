import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { sendSuccess, sendCreated } from '../../shared/utils/api-response';
import type { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { materialService } from './material.service';

export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const result = await materialService.findAll(req.query as any);
  sendSuccess(res, result, 'Materials retrieved successfully');
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const material = await materialService.findById(id);
  sendSuccess(res, material, 'Material retrieved successfully');
});

export const create = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const material = await materialService.create(req.body, req.user!.id);
  sendCreated(res, material, 'Material created successfully');
});

export const update = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  const material = await materialService.update(id, req.body, req.user!.id);
  sendSuccess(res, material, 'Material updated successfully');
});

export const deleteMaterial = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  await materialService.delete(id, req.user!.id);
  sendSuccess(res, null, 'Material deleted successfully');
});

export const recordDownload = asyncHandler(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  const material = await materialService.recordDownload(id, req.body, req.user!.id, req.user!.role);
  sendSuccess(res, material, 'Download recorded successfully');
});

export const getByFaculty = asyncHandler(async (req: Request, res: Response) => {
  const { facultyId } = req.params;
  const materials = await materialService.getByFaculty(facultyId);
  sendSuccess(res, materials, 'Faculty materials retrieved successfully');
});

export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await materialService.getCategories();
  sendSuccess(res, categories, 'Categories retrieved successfully');
});
