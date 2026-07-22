import { Response, NextFunction } from 'express';
import { IAuthRequest } from './auth.middleware';
import { AppError } from '../errors/AppError';

type ResourceAccessor = (req: IAuthRequest) => { ownerField: string; ownerValue: string | undefined } | null;

const resourceAccessors: Record<string, ResourceAccessor> = {
  students: (req) => {
    const id = req.params.id;
    if (id && req.user?.role === 'STUDENT' && req.user?.id !== id && req.user?.studentId !== id) {
      return { ownerField: 'id', ownerValue: req.user?.id || req.user?.studentId };
    }
    return null;
  },
  faculty: (req) => {
    const id = req.params.id;
    if (id && req.user?.role === 'FACULTY' && req.user?.id !== id && req.user?.facultyId !== id) {
      return { ownerField: 'id', ownerValue: req.user?.id || req.user?.facultyId };
    }
    return null;
  },
};

export function restrictToOwner(resource: string) {
  return (req: IAuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required'));
    }

    if (req.user.role === 'SUPER_ADMIN' || req.user.role === 'ADMIN') {
      return next();
    }

    const accessor = resourceAccessors[resource];
    if (accessor) {
      const result = accessor(req);
      if (result && result.ownerValue !== req.params.id) {
        return next(AppError.forbidden('You can only access your own data'));
      }
    }

    next();
  };
}

export function filterByOwnership(resource: string) {
  return (req: IAuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required'));
    }

    if (req.user.role === 'SUPER_ADMIN' || req.user.role === 'ADMIN') {
      return next();
    }

    if (req.user.role === 'FACULTY' || req.user.role === 'HOD') {
      req.query.facultyId = req.user.id || req.user.facultyId;
    }

    if (req.user.role === 'STUDENT') {
      req.query.studentId = req.user.id || req.user.studentId;
    }

    if (req.user.role === 'PARENT') {
      req.query.parentId = req.user.id;
    }

    next();
  };
}
