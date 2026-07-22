import { Router } from 'express';
import { authenticate, authorize, requirePermission } from '../../shared/middleware/auth.middleware';
import { UserRole, Permission } from '../../shared/enums';
import * as parentDashboardController from './parent-dashboard.controller';

const router = Router();

router.use(authenticate);
router.use(authorize(UserRole.PARENT));
router.use(requirePermission(Permission.READ_DASHBOARD));

router.get('/overview', parentDashboardController.getOverview);
router.get('/attendance', parentDashboardController.getAttendance);
router.get('/timetable', parentDashboardController.getTimetable);
router.get('/assignments', parentDashboardController.getAssignments);
router.get('/marks', parentDashboardController.getMarks);
router.get('/materials', parentDashboardController.getMaterials);
router.get('/fees', parentDashboardController.getFees);
router.get('/notifications', parentDashboardController.getNotifications);
router.patch('/profile', parentDashboardController.updateProfile);
router.patch('/change-password', parentDashboardController.changePassword);

export default router;
