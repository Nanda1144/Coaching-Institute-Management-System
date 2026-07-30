import { Router } from 'express';
import { authenticate, authorize, requirePermission } from '../../shared/middleware/auth.middleware';
import { UserRole, Permission } from '../../shared/enums';
import { examMarksController } from './exam-marks.controller';

const router = Router({ mergeParams: true });

router.get('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY, UserRole.STUDENT, UserRole.PARENT), examMarksController.getMarks);

router.post('/upload', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), requirePermission(Permission.UPDATE_EXAM), examMarksController.uploadMarks);

export default router;
