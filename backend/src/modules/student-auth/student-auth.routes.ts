import { Router } from 'express';
import { validate } from '../../shared/middleware/validate.middleware';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { studentLoginSchema } from './student-auth.validator';
import * as studentAuthController from './student-auth.controller';

const router = Router();

router.post('/login', validate(studentLoginSchema), studentAuthController.login);
router.post('/refresh-token', studentAuthController.refreshToken);
router.post('/logout', studentAuthController.logout);
router.get('/me', authenticate, studentAuthController.getMe);

export default router;
