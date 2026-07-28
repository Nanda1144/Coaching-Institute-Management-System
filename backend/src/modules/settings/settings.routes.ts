import { Router } from 'express';
import { authenticate, authorize, requirePermission } from '../../shared/middleware/auth.middleware';
import { UserRole, Permission } from '../../shared/enums';
import { validate } from '../../shared/middleware/validate.middleware';
import { updateSettingsSchema, sectionParamSchema } from './settings.validator';
import { settingsController } from './settings.controller';

const router = Router();

router.get('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), settingsController.getAll);

router.get('/:section', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(sectionParamSchema, 'params'), settingsController.getSection);

router.patch('/:section', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.MANAGE_SETTINGS), validate(sectionParamSchema, 'params'), validate(updateSettingsSchema), settingsController.upsert);

export default router;
