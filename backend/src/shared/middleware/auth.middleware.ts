import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { prisma } from '../../config/database';
import { AppError } from '../errors/AppError';

export interface IJwtPayload {
  id: string;
  facultyId?: string;
  studentId?: string;
  role: string;
  permissions?: string[];
}

export interface IAuthRequest extends Request {
  user?: IJwtPayload;
}

let cachedDevUser: IJwtPayload | null = null;
let cachePromise: Promise<IJwtPayload> | null = null;

function devFallbackUser(): IJwtPayload {
  return { id: 'dev-admin-id', facultyId: 'dev-faculty-id', role: 'SUPER_ADMIN', permissions: ['*'] };
}

async function resolveDevUser(): Promise<IJwtPayload> {
  if (cachedDevUser) return cachedDevUser;
  if (cachePromise) return cachePromise;
  cachePromise = (async () => {
    try {
      const firstFaculty = await prisma.faculty.findFirst({
        where: { isDeleted: false },
        orderBy: { createdAt: 'asc' },
        select: { id: true, facultyId: true },
      });
      if (firstFaculty) {
        cachedDevUser = { id: firstFaculty.id, facultyId: firstFaculty.facultyId, role: 'SUPER_ADMIN', permissions: ['*'] };
      } else {
        cachedDevUser = devFallbackUser();
      }
    } catch {
      cachedDevUser = devFallbackUser();
    }
    cachePromise = null;
    return cachedDevUser;
  })();
  return cachePromise;
}

export async function authenticate(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
  if (env.SKIP_AUTH === 'true') {
    if (env.NODE_ENV === 'production') {
      return next(AppError.unauthorized('Authentication required'));
    }
    console.warn('⚠️  SKIP_AUTH enabled — all users will be SUPER_ADMIN. Disable in production.');
    req.user = await resolveDevUser();
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(AppError.unauthorized('No token provided'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as IJwtPayload;
    req.user = decoded;
    next();
  } catch {
    return next(AppError.unauthorized('Invalid or expired token'));
  }
}

export function authorize(...roles: string[]) {
  return (req: IAuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required'));
    }
    if (!roles.includes(req.user.role)) {
      return next(AppError.forbidden('Insufficient role permissions'));
    }
    next();
  };
}

export function requirePermission(...permissions: string[]) {
  return (req: IAuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required'));
    }
    if (req.user.permissions?.includes('*')) {
      return next();
    }
    const userPermissions = req.user.permissions ?? [];
    const hasAll = permissions.every((p) => userPermissions.includes(p));
    if (!hasAll) {
      return next(AppError.forbidden('Insufficient permissions'));
    }
    next();
  };
}
