import { Router } from 'express';
import { authenticate, authorize, requirePermission } from '../../shared/middleware/auth.middleware';
import { UserRole, Permission } from '../../shared/enums';
import { validate } from '../../shared/middleware/validate.middleware';
import { facultyController } from './faculty.controller';
import * as studentRegistrationController from '../student-auth/student-registration.controller';
import { registrationApprovalSchema } from '../student-auth/student-registration.validator';
import {
  createFacultySchema,
  updateFacultySchema,
  facultyQuerySchema,
} from './faculty.validator';
import {
  createBulkDeleteHandler,
  createBulkUpdateHandler,
  createImportHandler,
  createExportHandler,
} from '../../shared/utils/bulk-operations';

const router = Router();

router.get(
  '/',
  authenticate,
  authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD),
  requirePermission(Permission.READ_FACULTY),
  validate(facultyQuerySchema, 'query'),
  facultyController.getAll
);

router.get('/profile', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), facultyController.getProfile);

router.get('/dashboard', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), facultyController.getDashboardStats);

// Student registration approval (must be before /:id)
router.get('/registration-requests', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), requirePermission(Permission.READ_STUDENT), studentRegistrationController.getAll);
router.patch('/registration-requests/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), requirePermission(Permission.UPDATE_STUDENT), validate(registrationApprovalSchema), studentRegistrationController.review);

router.get('/export', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createExportHandler('faculty', 'Faculty'));
router.get('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), requirePermission(Permission.READ_FACULTY), facultyController.getById);

router.post(
  '/',
  authenticate,
  authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  requirePermission(Permission.CREATE_FACULTY),
  validate(createFacultySchema, 'body'),
  facultyController.create
);

router.post('/bulk-delete', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createBulkDeleteHandler('faculty', 'Faculty'));
router.post('/bulk-update', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createBulkUpdateHandler('faculty', 'Faculty'));
router.post('/import', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createImportHandler('faculty', 'Faculty'));

router.patch(
  '/:id',
  authenticate,
  authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  requirePermission(Permission.UPDATE_FACULTY),
  validate(updateFacultySchema, 'body'),
  facultyController.update
);

router.delete('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.DELETE_FACULTY), facultyController.delete);

export default router;
