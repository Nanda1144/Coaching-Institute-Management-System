import { Router } from 'express';
import { authenticate, authorize, requirePermission } from '../../shared/middleware/auth.middleware';
import { UserRole, Permission } from '../../shared/enums';
import { validate } from '../../shared/middleware/validate.middleware';
import { createReminderSchema, updateReminderSchema, reminderQuerySchema } from './reminder.validator';
import { reminderController } from './reminder.controller';
import {
  createBulkDeleteHandler,
  createBulkUpdateHandler,
  createImportHandler,
  createExportHandler,
} from '../../shared/utils/bulk-operations';

const router = Router();

router.get('/my/:facultyId', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), reminderController.getMyReminders);

router.get('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), requirePermission(Permission.READ_ASSIGNMENT), validate(reminderQuerySchema, 'query'), reminderController.getAll);

router.get('/export', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createExportHandler('assignment_reminders', 'Reminder'));
router.get('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), reminderController.getById);

router.post('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), requirePermission(Permission.CREATE_ASSIGNMENT), validate(createReminderSchema), reminderController.create);

router.post('/bulk-delete', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createBulkDeleteHandler('assignment_reminders', 'Reminder'));
router.post('/bulk-update', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createBulkUpdateHandler('assignment_reminders', 'Reminder'));
router.post('/import', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createImportHandler('assignment_reminders', 'Reminder'));

router.patch('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), requirePermission(Permission.UPDATE_ASSIGNMENT), validate(updateReminderSchema), reminderController.update);

router.patch('/:id/sent', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), reminderController.markSent);

router.delete('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.DELETE_ASSIGNMENT), reminderController.delete);

export default router;
