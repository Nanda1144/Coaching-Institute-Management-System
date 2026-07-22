import { Router } from 'express';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { UserRole } from '../../shared/enums';
import { validate } from '../../shared/middleware/validate.middleware';
import { uploadMiddleware } from '../../shared/middleware/upload.middleware';
import { cloudDocumentsController } from './cloud-documents.controller';
import { uploadCloudSchema, cloudDocumentQuerySchema, cloudDocumentIdSchema } from './cloud-documents.validator';

const router = Router();

router.get('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), validate(cloudDocumentQuerySchema, 'query'), cloudDocumentsController.getAll);
router.get('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(cloudDocumentIdSchema), cloudDocumentsController.getById);
router.post('/upload', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), uploadMiddleware.single('file'), validate(uploadCloudSchema), cloudDocumentsController.upload);
router.delete('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), cloudDocumentsController.delete);
router.get('/student/:studentId', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), cloudDocumentsController.getByStudent);

export default router;
