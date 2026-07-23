import { Router } from 'express';
import { authenticate, authorize, requirePermission } from '../../shared/middleware/auth.middleware';
import { UserRole, Permission } from '../../shared/enums';
import { validate } from '../../shared/middleware/validate.middleware';
import { adminController } from './admin.controller';
import { updatePermissionsSchema } from './admin.validator';

const router = Router();

router.get(
  '/users',
  authenticate,
  authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  requirePermission(Permission.MANAGE_ROLES),
  adminController.listUsers,
);

router.put(
  '/users/:id/permissions',
  authenticate,
  authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  requirePermission(Permission.MANAGE_ROLES),
  validate(updatePermissionsSchema),
  adminController.updatePermissions,
);

export default router;
