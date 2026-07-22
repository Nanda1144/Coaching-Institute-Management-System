import { Router } from 'express';
import { authenticate, authorize, requirePermission } from '../../shared/middleware/auth.middleware';
import { UserRole, Permission } from '../../shared/enums';
import { validate } from '../../shared/middleware/validate.middleware';
import {
  createFacultyTransferSchema,
  updateFacultyTransferStatusSchema,
  facultyTransferQuerySchema,
} from './faculty-transfer.validator';
import { facultyTransferController } from './faculty-transfer.controller';
import {
  createBulkDeleteHandler,
  createImportHandler,
  createExportHandler,
} from '../../shared/utils/bulk-operations';

const router = Router();

router.get('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), requirePermission(Permission.READ_FACULTY), validate(facultyTransferQuerySchema, 'query'), facultyTransferController.getAll);

router.get('/faculty/:facultyId', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), facultyTransferController.getByFaculty);

router.get('/export', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createExportHandler('faculty_transfers', 'FacultyTransfer'));
router.get('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), facultyTransferController.getById);

router.post('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), requirePermission(Permission.UPDATE_FACULTY), validate(createFacultyTransferSchema), facultyTransferController.create);

router.post('/bulk-delete', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createBulkDeleteHandler('faculty_transfers', 'FacultyTransfer'));
router.post('/import', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createImportHandler('faculty_transfers', 'FacultyTransfer'));

router.patch('/:id/status', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), validate(updateFacultyTransferStatusSchema), facultyTransferController.updateStatus);

export default router;
