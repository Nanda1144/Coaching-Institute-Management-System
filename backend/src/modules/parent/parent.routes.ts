import { Router } from 'express';
import { validate } from '../../shared/middleware/validate.middleware';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { UserRole } from '../../shared/enums';
import { parentController } from './parent.controller';
import { createParentSchema, updateParentSchema, parentQuerySchema, linkStudentSchema, notificationPrefsSchema } from './parent.validator';

const router = Router();

// CRUD
router.get('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), validate(parentQuerySchema, 'query'), parentController.getAll);
router.get('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), parentController.getById);
router.post('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(createParentSchema), parentController.create);
router.put('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(updateParentSchema), parentController.update);
router.delete('/:id', authenticate, authorize(UserRole.SUPER_ADMIN), parentController.delete);

// Linking
router.get('/:id/students', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), parentController.getLinkedStudents);
router.post('/:id/students', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(linkStudentSchema), parentController.linkStudent);
router.delete('/:id/students/:studentId', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), parentController.unlinkStudent);
router.get('/by-student/:studentId', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), parentController.getParentsByStudent);

// Notification preferences
router.patch('/:id/notification-prefs', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(notificationPrefsSchema), parentController.updateNotificationPrefs);

// Dashboard
router.get('/:id/dashboard', authenticate, parentController.getDashboard);

export default router;
