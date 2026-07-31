import { Router } from 'express';
import { validate } from '../../shared/middleware/validate.middleware';
import { adminRegistrationSchema } from './admin-auth.validator';
import * as adminAuthController from './admin-auth.controller';

const router = Router();

router.post('/register', validate(adminRegistrationSchema), adminAuthController.register);

export default router;
