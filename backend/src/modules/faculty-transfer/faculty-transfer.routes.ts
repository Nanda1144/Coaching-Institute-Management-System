import { Router } from 'express';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { UserRole } from '../../shared/enums';
import { validate } from '../../shared/middleware/validate.middleware';
import {
  createFacultyTransferSchema,
  updateFacultyTransferStatusSchema,
  facultyTransferQuerySchema,
} from './faculty-transfer.validator';
import { facultyTransferController } from './faculty-transfer.controller';
import { prisma } from '../../config/database';
import {
  createBulkDeleteHandler,
  createImportHandler,
  createExportHandler,
} from '../../shared/utils/bulk-operations';

const router = Router();

router.get('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), validate(facultyTransferQuerySchema, 'query'), facultyTransferController.getAll);

router.get('/faculty/:facultyId', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), facultyTransferController.getByFaculty);

router.get('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), facultyTransferController.getById);

router.post('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), validate(createFacultyTransferSchema), facultyTransferController.create);

router.post('/bulk-delete', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createBulkDeleteHandler(prisma.facultyTransfer, 'FacultyTransfer'));
router.post('/import', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createImportHandler(prisma.facultyTransfer, 'FacultyTransfer'));
router.get('/export', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createExportHandler(prisma.facultyTransfer, 'FacultyTransfer'));

router.patch('/:id/status', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), validate(updateFacultyTransferStatusSchema), facultyTransferController.updateStatus);

export default router;
