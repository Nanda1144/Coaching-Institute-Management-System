import { Router } from 'express';
import { authenticate, authorize, requirePermission } from '../../shared/middleware/auth.middleware';
import { UserRole, Permission } from '../../shared/enums';
import { validate } from '../../shared/middleware/validate.middleware';
import { branchController } from './branch.controller';
import { createBranchSchema, updateBranchSchema, branchQuerySchema } from './branch.validator';

const router = Router();

router.get('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.READ_BRANCH), validate(branchQuerySchema, 'query'), branchController.getAll);
router.get('/list', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), branchController.getList);
router.get('/analytics/summary', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.READ_ANALYTICS), branchController.getAnalyticsSummary);
router.get('/analytics/admissions', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), branchController.getAdmissionsTrend);
router.get('/analytics/revenue', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), branchController.getRevenueTrend);
router.get('/analytics/attendance', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), branchController.getAttendanceTrend);
router.get('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.READ_BRANCH), branchController.getById);
router.post('/', authenticate, authorize(UserRole.SUPER_ADMIN), requirePermission(Permission.CREATE_BRANCH), validate(createBranchSchema), branchController.create);
router.put('/:id', authenticate, authorize(UserRole.SUPER_ADMIN), requirePermission(Permission.UPDATE_BRANCH), validate(updateBranchSchema), branchController.update);
router.delete('/:id', authenticate, authorize(UserRole.SUPER_ADMIN), requirePermission(Permission.DELETE_BRANCH), branchController.delete);
router.patch('/:id/status', authenticate, authorize(UserRole.SUPER_ADMIN), branchController.toggleStatus);

export default router;
