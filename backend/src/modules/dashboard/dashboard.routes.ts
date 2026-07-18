import { Router } from 'express';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { UserRole } from '../../shared/enums';
import { dashboardController } from './dashboard.controller';

const router = Router();

router.get('/admin', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), dashboardController.getAdminStats);

router.get('/faculty/:facultyId', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), dashboardController.getFacultyStats);

router.get('/recent-activities', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), dashboardController.getRecentActivities);

export default router;
