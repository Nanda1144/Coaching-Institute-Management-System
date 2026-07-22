import { Request, Response, NextFunction } from 'express';
import { IAuthRequest } from './auth.middleware';
import { query } from '../../config/database';

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'APPROVE' | 'REJECT' | 'HOLD' | 'UPLOAD' | 'DOWNLOAD' | 'OTHER';

export interface AuditEntry {
  action: AuditAction;
  entity: string;
  entityId?: string;
  oldValue?: any;
  newValue?: any;
  metadata?: Record<string, any>;
}

export async function createAuditLog(
  actorId: string | undefined | null,
  actorRole: string | undefined | null,
  entry: AuditEntry,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  try {
    await query(
      `INSERT INTO "audit_logs" (actor_id, actor_role, action, entity, entity_id, old_value, new_value, ip_address, user_agent, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        actorId || null,
        actorRole || null,
        entry.action,
        entry.entity,
        entry.entityId || null,
        entry.oldValue ? JSON.stringify(entry.oldValue) : null,
        entry.newValue ? JSON.stringify(entry.newValue) : null,
        ipAddress || null,
        userAgent || null,
        entry.metadata ? JSON.stringify(entry.metadata) : '{}',
      ]
    );
  } catch (err) {
    console.error('Failed to create audit log:', err);
  }
}

export function auditMiddleware(entry: AuditEntry) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authReq = req as IAuthRequest;
    const actorId = authReq.user?.id || authReq.user?.facultyId || null;
    const actorRole = authReq.user?.role || null;
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    await createAuditLog(actorId, actorRole, entry, ipAddress, userAgent);
    next();
  };
}

export function auditOnResponse(entryFn: (req: Request, res: Response) => AuditEntry) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const originalJson = res.json.bind(res);
    res.json = function (body: any) {
      const authReq = req as IAuthRequest;
      const actorId = authReq.user?.id || authReq.user?.facultyId || null;
      const actorRole = authReq.user?.role || null;
      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const entry = entryFn(req, res);
      if (entry) {
        createAuditLog(actorId, actorRole, entry, ipAddress, userAgent);
      }

      return originalJson(body);
    };
    next();
  };
}
