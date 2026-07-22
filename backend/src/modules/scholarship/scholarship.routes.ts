import { Router } from 'express';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { UserRole } from '../../shared/enums';
import { validate } from '../../shared/middleware/validate.middleware';
import { scholarshipController } from './scholarship.controller';
import { createScholarshipSchema, updateScholarshipSchema, scholarshipIdSchema, scholarshipQuerySchema } from './scholarship.validator';

const router = Router();

router.get('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), validate(scholarshipQuerySchema, 'query'), scholarshipController.getAll);
router.get('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(scholarshipIdSchema), scholarshipController.getById);
router.post('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(createScholarshipSchema), scholarshipController.create);
router.put('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(updateScholarshipSchema), scholarshipController.update);
router.delete('/:id', authenticate, authorize(UserRole.SUPER_ADMIN), scholarshipController.delete);

export default router;
