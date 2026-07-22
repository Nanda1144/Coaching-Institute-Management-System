import { Router } from 'express';
import { authenticate, authorize, requirePermission } from '../../shared/middleware/auth.middleware';
import { UserRole, Permission } from '../../shared/enums';
import { reportController } from './reports.controller';

const router = Router();

const guard = [authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.READ_REPORT)];

router.get('/', ...guard, reportController.getAll);
router.get('/attendance', ...guard, reportController.getAttendance);
router.get('/students', ...guard, reportController.getStudents);
router.get('/faculty', ...guard, reportController.getFaculty);
router.get('/fees', ...guard, reportController.getFees);
router.get('/exams', ...guard, reportController.getExams);
router.get('/student', ...guard, reportController.getStudentReport);
router.get('/export/pdf', ...guard, reportController.exportPdf);
router.get('/export/excel', ...guard, reportController.exportExcel);

export default router;
