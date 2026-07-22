import { Router } from 'express';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { UserRole } from '../../shared/enums';
import { validate } from '../../shared/middleware/validate.middleware';
import { enrollmentController } from './enrollment.controller';
import { createEnrollmentSchema, enrollmentIdSchema, enrollmentQuerySchema } from './enrollment.validator';

const router = Router();

router.get('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(enrollmentQuerySchema, 'query'), enrollmentController.getAll);
router.get('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.FACULTY), validate(enrollmentIdSchema), enrollmentController.getById);
router.post('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(createEnrollmentSchema), enrollmentController.create);
router.delete('/:id', authenticate, authorize(UserRole.SUPER_ADMIN), enrollmentController.delete);
router.patch('/:id/status', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), enrollmentController.updateStatus);

export default router;
