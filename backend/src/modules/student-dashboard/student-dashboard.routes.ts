import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth.middleware';
import * as studentDashboardController from './student-dashboard.controller';

const router = Router();

router.use(authenticate);

router.get('/overview', studentDashboardController.getOverview);
router.get('/attendance', studentDashboardController.getAttendance);
router.get('/timetable', studentDashboardController.getTimetable);
router.get('/assignments', studentDashboardController.getAssignments);
router.get('/marks', studentDashboardController.getMarks);
router.get('/materials', studentDashboardController.getMaterials);
router.get('/fees', studentDashboardController.getFees);
router.get('/notifications', studentDashboardController.getNotifications);
router.patch('/notifications/:id/read', studentDashboardController.markRead);

export default router;
