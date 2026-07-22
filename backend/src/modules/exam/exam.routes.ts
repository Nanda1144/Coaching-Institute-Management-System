import { Router } from 'express';
import { validate } from '../../shared/middleware/validate.middleware';
import { authenticate, authorize, requirePermission } from '../../shared/middleware/auth.middleware';
import { UserRole, Permission } from '../../shared/enums';
import { examController } from './exam.controller';
import { createExamSchema, updateExamSchema, examQuerySchema } from './exam.validator';

const router = Router();

router.get('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STUDENT), requirePermission(Permission.READ_EXAM), validate(examQuerySchema, 'query'), examController.getAll);
router.get('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STUDENT), requirePermission(Permission.READ_EXAM), examController.getById);
router.post('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.CREATE_EXAM), validate(createExamSchema), examController.create);
router.patch('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.UPDATE_EXAM), validate(updateExamSchema), examController.update);
router.delete('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.DELETE_EXAM), examController.delete);

export default router;
