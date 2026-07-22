import { Router } from 'express';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import * as referencesController from './references.controller';

const router = Router();

router.get('/departments', referencesController.getDepartments);
router.post('/departments', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), referencesController.createDepartment);
router.put('/departments/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), referencesController.updateDepartment);
router.delete('/departments/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), referencesController.deleteDepartment);

router.get('/courses', referencesController.getCourses);
router.post('/courses', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), referencesController.createCourse);
router.put('/courses/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), referencesController.updateCourse);
router.delete('/courses/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), referencesController.deleteCourse);

router.get('/batches', referencesController.getBatches);
router.get('/faculty', referencesController.getFaculty);

export default router;
