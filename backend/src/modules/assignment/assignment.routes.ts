import { Router } from 'express';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { UserRole } from '../../shared/enums';
import { validate } from '../../shared/middleware/validate.middleware';
import { createAssignmentSchema, updateAssignmentSchema, assignmentQuerySchema } from './assignment.validator';
import * as assignmentController from './assignment.controller';
import { prisma } from '../../config/database';
import {
  createBulkDeleteHandler,
  createBulkUpdateHandler,
  createImportHandler,
  createExportHandler,
} from '../../shared/utils/bulk-operations';

const router = Router();

router.get('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), validate(assignmentQuerySchema, 'query'), assignmentController.getAll);
router.get('/faculty/:facultyId', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), assignmentController.getByFaculty);
router.post('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), validate(createAssignmentSchema), assignmentController.create);
router.post('/bulk-delete', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createBulkDeleteHandler(prisma.assignment, 'Assignment'));
router.post('/bulk-update', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createBulkUpdateHandler(prisma.assignment, 'Assignment'));
router.post('/import', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createImportHandler(prisma.assignment, 'Assignment'));
router.get('/export', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createExportHandler(prisma.assignment, 'Assignment'));
router.patch('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), validate(updateAssignmentSchema), assignmentController.update);
router.delete('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), assignmentController.deleteAssignment);
router.get('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), assignmentController.getById);

export default router;
