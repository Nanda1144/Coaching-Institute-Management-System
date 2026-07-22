import { Router } from 'express';
import { authenticate, authorize, requirePermission } from '../../shared/middleware/auth.middleware';
import { UserRole, Permission } from '../../shared/enums';
import { validate } from '../../shared/middleware/validate.middleware';
import { certificateController } from './certificate.controller';
import { createCertificateSchema, updateCertificateSchema, certificateQuerySchema } from './certificate.validator';

const router = Router();

router.get('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), requirePermission(Permission.READ_CERTIFICATE), validate(certificateQuerySchema, 'query'), certificateController.getAll);
router.get('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY, UserRole.STUDENT), requirePermission(Permission.READ_CERTIFICATE), certificateController.getById);
router.get('/:id/preview', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), certificateController.getPreview);
router.get('/:id/placeholders', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), certificateController.getPlaceholders);
router.get('/:id/download', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY, UserRole.STUDENT), certificateController.download);
router.post('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.CREATE_CERTIFICATE), validate(createCertificateSchema), certificateController.create);
router.put('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.UPDATE_CERTIFICATE), validate(updateCertificateSchema), certificateController.update);
router.patch('/:id/placeholders', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), certificateController.updatePlaceholders);
router.delete('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.DELETE_CERTIFICATE), certificateController.delete);

export default router;
