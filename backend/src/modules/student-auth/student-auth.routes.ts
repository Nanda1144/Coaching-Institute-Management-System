import { Router } from 'express';
import { validate } from '../../shared/middleware/validate.middleware';
import { authenticate, authorize, requirePermission } from '../../shared/middleware/auth.middleware';
import { UserRole, Permission } from '../../shared/enums';
import { studentLoginSchema } from './student-auth.validator';
import { studentRegistrationSchema } from './student-registration.validator';
import * as studentAuthController from './student-auth.controller';
import * as studentRegistrationController from './student-registration.controller';

const router = Router();

router.post('/login', validate(studentLoginSchema), studentAuthController.login);
router.post('/register', validate(studentRegistrationSchema), studentRegistrationController.register);
router.post('/refresh-token', studentAuthController.refreshToken);
router.post('/logout', studentAuthController.logout);
router.get('/me', authenticate, authorize(UserRole.STUDENT), studentAuthController.getMe);

export default router;
