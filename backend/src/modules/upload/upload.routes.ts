import { Router } from 'express';
import multer from 'multer';
import { authenticate, authorize, requirePermission } from '../../shared/middleware/auth.middleware';
import { UserRole, Permission } from '../../shared/enums';
import { validate } from '../../shared/middleware/validate.middleware';
import { uploadFileSchema, uploadQuerySchema } from './upload.validator';
import { uploadController } from './upload.controller';
import { createBulkDeleteHandler } from '../../shared/utils/bulk-operations';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.post(
  '/',
  authenticate,
  authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY),
  requirePermission(Permission.CREATE_MATERIAL),
  upload.single('file'),
  validate(uploadFileSchema),
  uploadController.uploadFile
);

router.post(
  '/public',
  upload.single('file'),
  uploadController.uploadPublic
);

router.get('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), validate(uploadQuerySchema, 'query'), uploadController.getAll);

router.post('/bulk-delete', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createBulkDeleteHandler('uploads', 'Upload'));

router.delete('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), uploadController.delete);

export default router;
