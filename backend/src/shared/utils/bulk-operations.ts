import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error-handler.middleware';
import { sendSuccess, sendError } from './api-response';
import { IAuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../../config/database';
import { AppError } from '../errors/AppError';

type PrismaModel = {
  update: (args: any) => Promise<any>;
  findFirst: (args: any) => Promise<any>;
  findMany: (args: any) => Promise<any[]>;
  count: (args: any) => Promise<number>;
  create: (args: any) => Promise<any>;
};

export function createBulkDeleteHandler(model: PrismaModel, entityName: string) {
  return asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      sendError(res, 400, 'ids must be a non-empty array');
      return;
    }
    const results = await Promise.allSettled(
      ids.map((id: string) =>
        model.update({
          where: { id },
          data: { isDeleted: true, deletedAt: new Date(), updatedById: req.user!.id },
        })
      )
    );
    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;
    sendSuccess(res, { succeeded, failed }, `${entityName} bulk delete completed`);
  });
}

export function createBulkUpdateHandler(model: PrismaModel, entityName: string) {
  return asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { ids, ...updateData } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      sendError(res, 400, 'ids must be a non-empty array');
      return;
    }
    const results = await Promise.allSettled(
      ids.map((id: string) =>
        model.update({
          where: { id },
          data: { ...updateData, updatedById: req.user!.id },
        })
      )
    );
    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;
    sendSuccess(res, { succeeded, failed }, `${entityName} bulk update completed`);
  });
}

export function createImportHandler(model: PrismaModel, entityName: string) {
  return asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { records } = req.body;
    if (!Array.isArray(records) || records.length === 0) {
      sendError(res, 400, 'records must be a non-empty array');
      return;
    }
    const results = await Promise.allSettled(
      records.map((record: any) =>
        model.create({
          data: { ...record, createdById: req.user!.id },
        })
      )
    );
    const created = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;
    sendSuccess(res, { created, failed, total: records.length }, `${entityName} import completed`);
  });
}

export function createExportHandler(model: PrismaModel, entityName: string) {
  return asyncHandler(async (req: Request, res: Response) => {
    const data = await model.findMany({ where: { isDeleted: false } });
    sendSuccess(res, data, `${entityName} export data retrieved`);
  });
}
