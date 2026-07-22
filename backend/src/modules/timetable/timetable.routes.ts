import { Router } from 'express';
import { authenticate, authorize, requirePermission } from '../../shared/middleware/auth.middleware';
import { UserRole, Permission } from '../../shared/enums';
import { validate } from '../../shared/middleware/validate.middleware';
import { timetableQuerySchema, createTimetableSchema, updateTimetableSchema } from './timetable.validator';
import * as timetableController from './timetable.controller';
import {
  createBulkDeleteHandler,
  createBulkUpdateHandler,
  createImportHandler,
  createExportHandler,
} from '../../shared/utils/bulk-operations';

const router = Router();

router.use(authenticate);

router.get('/', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), requirePermission(Permission.READ_TIMETABLE), validate(timetableQuerySchema, 'query'), timetableController.getAll);
router.get('/faculty/:facultyId', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), timetableController.getByFaculty);
router.get('/faculty/:facultyId/day/:dayOfWeek', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), timetableController.getByDay);
router.get('/export', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createExportHandler('timetables', 'Timetable'));
router.get('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), timetableController.getById);
router.post('/', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.CREATE_TIMETABLE), validate(createTimetableSchema), timetableController.create);
router.post('/bulk-delete', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createBulkDeleteHandler('timetables', 'Timetable'));
router.post('/bulk-update', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createBulkUpdateHandler('timetables', 'Timetable'));
router.post('/import', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createImportHandler('timetables', 'Timetable'));
router.patch('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.UPDATE_TIMETABLE), validate(updateTimetableSchema), timetableController.update);
router.delete('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.DELETE_TIMETABLE), timetableController.deleteTimetable);

export default router;
