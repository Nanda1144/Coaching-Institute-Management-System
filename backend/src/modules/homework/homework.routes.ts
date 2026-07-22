import { Router } from 'express';
import { authenticate, authorize, requirePermission } from '../../shared/middleware/auth.middleware';
import { UserRole, Permission } from '../../shared/enums';
import { validate } from '../../shared/middleware/validate.middleware';
import { homeworkController } from './homework.controller';
import {
  createHomeworkSchema,
  updateHomeworkSchema,
  homeworkQuerySchema,
} from './homework.validator';
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
  requirePermission(Permission.READ_HOMEWORK),
  validate(homeworkQuerySchema, 'query'),
  homeworkController.getAll
);

router.get('/faculty/:facultyId', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), homeworkController.getByFaculty);

router.get('/export', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createExportHandler('homeworks', 'Homework'));
router.get('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), homeworkController.getById);

router.post(
  '/',
  authenticate,
  authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD),
  requirePermission(Permission.CREATE_HOMEWORK),
  validate(createHomeworkSchema, 'body'),
  homeworkController.create
);

router.post('/bulk-delete', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createBulkDeleteHandler('homeworks', 'Homework'));
router.post('/bulk-update', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createBulkUpdateHandler('homeworks', 'Homework'));
router.post('/import', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createImportHandler('homeworks', 'Homework'));
router.patch(
  '/:id',
  authenticate,
  authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD),
  requirePermission(Permission.UPDATE_HOMEWORK),
  validate(updateHomeworkSchema, 'body'),
  homeworkController.update
);

router.delete('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.DELETE_HOMEWORK), homeworkController.delete);

export default router;
