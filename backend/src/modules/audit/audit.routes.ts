import { Router } from 'express';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { UserRole } from '../../shared/enums';
import { validate } from '../../shared/middleware/validate.middleware';
import { auditController } from './audit.controller';
import { createAuditSchema, auditQuerySchema } from './audit.validator';

const router = Router();

router.get('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(auditQuerySchema, 'query'), auditController.getAll);
router.get('/summary', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), auditController.getSummary);
router.get('/user/:userId', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), auditController.getUserActivity);
router.get('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), auditController.getById);
router.post('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(createAuditSchema), auditController.create);

export default router;
