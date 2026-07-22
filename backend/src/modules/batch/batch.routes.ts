import { Router } from 'express';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { UserRole } from '../../shared/enums';
import { validate } from '../../shared/middleware/validate.middleware';
import { batchController } from './batch.controller';
import { createBatchSchema, updateBatchSchema, batchIdSchema, batchQuerySchema, allocateStudentSchema, deallocateStudentSchema, assignFacultySchema, transferStudentSchema, validateCapacitySchema } from './batch.validator';

const router = Router();

router.get('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), validate(batchQuerySchema, 'query'), batchController.getAll);
router.get('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), validate(batchIdSchema), batchController.getById);
router.post('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(createBatchSchema), batchController.create);
router.put('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(updateBatchSchema), batchController.update);
router.delete('/:id', authenticate, authorize(UserRole.SUPER_ADMIN), validate(batchIdSchema), batchController.delete);

router.get('/:batchId/students', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), batchController.getBatchStudents);
router.post('/:batchId/students', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(allocateStudentSchema), batchController.allocateStudent);
router.delete('/:batchId/students/:studentId', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(deallocateStudentSchema), batchController.deallocateStudent);

router.get('/:batchId/faculty', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), batchController.getBatchFaculty);
router.post('/:batchId/faculty', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(assignFacultySchema), batchController.assignFaculty);
router.delete('/:batchId/faculty', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), batchController.removeFaculty);

router.post('/transfer', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(transferStudentSchema), batchController.transferStudent);
router.get('/transfers/:studentId', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), batchController.getTransferHistory);

router.get('/:id/capacity', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), batchController.getCapacity);
router.post('/:id/validate-capacity', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(validateCapacitySchema), batchController.validateCapacity);
router.get('/:id/analytics', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), batchController.getAnalytics);

export default router;
