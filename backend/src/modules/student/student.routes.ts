import { Router } from 'express';
import { validate } from '../../shared/middleware/validate.middleware';
import { authenticate, authorize, requirePermission } from '../../shared/middleware/auth.middleware';
import { UserRole, Permission } from '../../shared/enums';
import { studentController } from './student.controller';
import { createStudentSchema, updateStudentSchema, studentQuerySchema } from './student.validator';

const router = Router();

router.get('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.FACULTY), requirePermission(Permission.READ_STUDENT), validate(studentQuerySchema, 'query'), studentController.getAll);
router.get('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.FACULTY), requirePermission(Permission.READ_STUDENT), studentController.getById);
router.post('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.CREATE_STUDENT), validate(createStudentSchema), studentController.create);
router.patch('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.UPDATE_STUDENT), validate(updateStudentSchema), studentController.update);
router.delete('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.DELETE_STUDENT), studentController.delete);

export default router;
