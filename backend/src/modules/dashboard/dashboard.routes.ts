import { Router } from 'express';
import { authenticate, authorize, requirePermission } from '../../shared/middleware/auth.middleware';
import { UserRole, Permission } from '../../shared/enums';
import { dashboardController } from './dashboard.controller';

const router = Router();

router.get('/admin', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.READ_DASHBOARD), dashboardController.getAdminStats);

router.get('/faculty/:facultyId', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), dashboardController.getFacultyStats);

router.get('/student/:studentId', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STUDENT), dashboardController.getStudentStats);

router.get('/parent/:parentId', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PARENT), dashboardController.getParentStats);

router.get('/recent-activities', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), dashboardController.getRecentActivities);

export default router;
