import { Router } from 'express';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { UserRole } from '../../shared/enums';
import { validate } from '../../shared/middleware/validate.middleware';
import { timetableQuerySchema, createTimetableSchema, updateTimetableSchema } from './timetable.validator';
import * as timetableController from './timetable.controller';
import { prisma } from '../../config/database';
import {
  createBulkDeleteHandler,
  createBulkUpdateHandler,
  createImportHandler,
  createExportHandler,
} from '../../shared/utils/bulk-operations';

const router = Router();

router.use(authenticate);

router.get('/', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), validate(timetableQuerySchema, 'query'), timetableController.getAll);
router.get('/faculty/:facultyId', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), timetableController.getByFaculty);
router.get('/faculty/:facultyId/day/:dayOfWeek', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), timetableController.getByDay);
router.get('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), timetableController.getById);
router.post('/', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(createTimetableSchema), timetableController.create);
router.post('/bulk-delete', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createBulkDeleteHandler(prisma.timetable, 'Timetable'));
router.post('/bulk-update', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createBulkUpdateHandler(prisma.timetable, 'Timetable'));
router.post('/import', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createImportHandler(prisma.timetable, 'Timetable'));
router.get('/export', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), createExportHandler(prisma.timetable, 'Timetable'));
router.patch('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(updateTimetableSchema), timetableController.update);
router.delete('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), timetableController.deleteTimetable);

export default router;
