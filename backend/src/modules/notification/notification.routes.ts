import { Router } from 'express';
import { validate } from '../../shared/middleware/validate.middleware';
import { authenticate, authorize, requirePermission } from '../../shared/middleware/auth.middleware';
import { UserRole, Permission } from '../../shared/enums';
import { notificationController } from './notification.controller';
import { createNotificationSchema, notificationQuerySchema } from './notification.validator';

const router = Router();

router.get('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.FACULTY, UserRole.STUDENT, UserRole.PARENT), requirePermission(Permission.READ_NOTIFICATION), validate(notificationQuerySchema, 'query'), notificationController.getAll);
router.get('/history', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY, UserRole.STUDENT, UserRole.PARENT), requirePermission(Permission.READ_NOTIFICATION), validate(notificationQuerySchema, 'query'), notificationController.getHistory);
router.post('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.SEND_NOTIFICATION), validate(createNotificationSchema), notificationController.send);
router.patch('/:id/read', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.FACULTY, UserRole.STUDENT), requirePermission(Permission.READ_NOTIFICATION), notificationController.markRead);
router.delete('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.MANAGE_SETTINGS), notificationController.remove);

export default router;
