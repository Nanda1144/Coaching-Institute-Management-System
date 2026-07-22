import { Router } from 'express';
import { authenticate, authorize, requirePermission } from '../../shared/middleware/auth.middleware';
import { UserRole, Permission } from '../../shared/enums';
import { validate } from '../../shared/middleware/validate.middleware';
import { createAssignmentSchema, updateAssignmentSchema, assignmentQuerySchema } from './assignment.validator';
import * as assignmentController from './assignment.controller';
import {
  createBulkDeleteHandler,
  createBulkUpdateHandler,
  createImportHandler,
  createExportHandler,
} from '../../shared/utils/bulk-operations';

const router = Router();

router.get('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), requirePermission(Permission.READ_ASSIGNMENT), validate(assignmentQuerySchema, 'query'), assignmentController.getAll);
router.get('/faculty/:facultyId', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), assignmentController.getByFaculty);
router.post('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), requirePermission(Permission.CREATE_ASSIGNMENT), validate(createAssignmentSchema), assignmentController.create);
router.post('/bulk-delete', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createBulkDeleteHandler('assignments', 'Assignment'));
router.post('/bulk-update', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createBulkUpdateHandler('assignments', 'Assignment'));
router.post('/import', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createImportHandler('assignments', 'Assignment'));
router.get('/export', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createExportHandler('assignments', 'Assignment'));
router.patch('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), requirePermission(Permission.UPDATE_ASSIGNMENT), validate(updateAssignmentSchema), assignmentController.update);
router.delete('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.DELETE_ASSIGNMENT), assignmentController.deleteAssignment);
router.get('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), assignmentController.getById);

export default router;
