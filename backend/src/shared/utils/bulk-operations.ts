import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error-handler.middleware';
import { sendSuccess, sendError } from './api-response';
import { IAuthRequest } from '../middleware/auth.middleware';
import { query } from '../../config/database';
import { transact } from './db';

export function createBulkDeleteHandler(table: string, entityName: string) {
  return asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      sendError(res, 400, 'ids must be a non-empty array');
      return;
    }
    const placeholders = ids.map((_, i) => `$${i + 2}`).join(', ');
    const result = await query(
      `UPDATE "${table}" SET is_deleted = true, deleted_at = NOW(), updated_by_id = $1 WHERE id IN (${placeholders})`,
      [req.user!.id, ...ids]
    );
    sendSuccess(res, { succeeded: result.rowCount, failed: 0 }, `${entityName} bulk delete completed`);
  });
}

export function createBulkUpdateHandler(table: string, entityName: string) {
  return asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { ids, ...updateData } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      sendError(res, 400, 'ids must be a non-empty array');
      return;
    }
    const setEntries = Object.entries(updateData).filter(([_, v]) => v !== undefined);
    if (setEntries.length === 0) {
      sendError(res, 400, 'No fields to update');
      return;
    }
    const setClauses = setEntries.map(([key], i) => {
      const snakeKey = key.replace(/[A-Z]/g, (l) => `_${l.toLowerCase()}`);
      return `"${snakeKey}" = $${i + 1}`;
    });
    setClauses.push(`updated_by_id = $${setEntries.length + 1}`);
    const placeholders = ids.map((_, i) => `$${setEntries.length + 2 + i}`).join(', ');
    const values = [...setEntries.map(([_, v]) => v), req.user!.id, ...ids];
    await query(
      `UPDATE "${table}" SET ${setClauses.join(', ')} WHERE id IN (${placeholders})`,
      values
    );
    sendSuccess(res, { succeeded: ids.length, failed: 0 }, `${entityName} bulk update completed`);
  });
}

export function createImportHandler(table: string, entityName: string) {
  return asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { records } = req.body;
    if (!Array.isArray(records) || records.length === 0) {
      sendError(res, 400, 'records must be a non-empty array');
      return;
    }
    const result = await transact(async (txnQuery) => {
      let created = 0;
      let failed = 0;
      for (const record of records) {
        try {
          const columns = Object.keys(record).map((k) => {
            const snakeKey = k.replace(/[A-Z]/g, (l) => `_${l.toLowerCase()}`);
            return `"${snakeKey}"`;
          });
          columns.push('"created_by_id"');
          const values = [...Object.values(record), req.user!.id];
          const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
          await txnQuery(
            `INSERT INTO "${table}" (${columns.join(', ')}) VALUES (${placeholders})`,
            values
          );
          created++;
        } catch {
          failed++;
        }
      }
      return { created, failed, total: records.length };
    });
    sendSuccess(res, result, `${entityName} import completed`);
  });
}

export function createExportHandler(table: string, entityName: string) {
  return asyncHandler(async (req: Request, res: Response) => {
    const result = await query(`SELECT * FROM "${table}" WHERE is_deleted = false`);
    sendSuccess(res, result.rows, `${entityName} export data retrieved`);
  });
}
