import { Router } from 'express';
import multer from 'multer';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { UserRole } from '../../shared/enums';
import { validate } from '../../shared/middleware/validate.middleware';
import { uploadFileSchema, uploadQuerySchema } from './upload.validator';
import { uploadController } from './upload.controller';
import { prisma } from '../../config/database';
import { createBulkDeleteHandler } from '../../shared/utils/bulk-operations';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.post(
  '/',
  authenticate,
  authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY),
  upload.single('file'),
  validate(uploadFileSchema),
  uploadController.uploadFile
);

router.get('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), validate(uploadQuerySchema, 'query'), uploadController.getAll);

router.post('/bulk-delete', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createBulkDeleteHandler(prisma.upload, 'Upload'));

router.delete('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), uploadController.delete);

export default router;
