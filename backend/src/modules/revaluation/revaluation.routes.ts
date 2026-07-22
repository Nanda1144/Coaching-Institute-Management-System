import { Router } from 'express';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { UserRole } from '../../shared/enums';
import { validate } from '../../shared/middleware/validate.middleware';
import { revaluationController } from './revaluation.controller';
import { createRevaluationSchema, updateRevaluationSchema, revaluationIdSchema, revaluationQuerySchema } from './revaluation.validator';

const router = Router();

router.get('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), validate(revaluationQuerySchema, 'query'), revaluationController.getAll);
router.get('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.FACULTY), validate(revaluationIdSchema), revaluationController.getById);
router.get('/:id/timeline', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.FACULTY), validate(revaluationIdSchema), revaluationController.getTimeline);
router.post('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.FACULTY), validate(createRevaluationSchema), revaluationController.create);
router.patch('/:id/status', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), validate(updateRevaluationSchema), revaluationController.updateStatus);

export default router;
