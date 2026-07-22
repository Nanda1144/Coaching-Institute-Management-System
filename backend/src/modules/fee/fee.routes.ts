import { Router } from 'express';
import { validate } from '../../shared/middleware/validate.middleware';
import { authenticate, authorize, requirePermission } from '../../shared/middleware/auth.middleware';
import { UserRole, Permission } from '../../shared/enums';
import { feeController } from './fee.controller';
import { createFeeTransactionSchema, updateFeeTransactionSchema, createFeePendingSchema, createFeeStructureSchema, createInstallmentSchema, updateInstallmentSchema, installmentIdSchema, feeQuerySchema } from './fee.validator';

const router = Router();

router.get('/transactions', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.READ_FEE), validate(feeQuerySchema, 'query'), feeController.getTransactions);
router.post('/transactions', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.CREATE_FEE), validate(createFeeTransactionSchema), feeController.createTransaction);
router.patch('/transactions/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.UPDATE_FEE), validate(updateFeeTransactionSchema), feeController.updateTransaction);
router.delete('/transactions/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.DELETE_FEE), feeController.deleteTransaction);
router.get('/pending', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.READ_FEE), validate(feeQuerySchema, 'query'), feeController.getPending);
router.post('/pending', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.CREATE_FEE), validate(createFeePendingSchema), feeController.createPending);
router.get('/structure', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.READ_FEE), validate(feeQuerySchema, 'query'), feeController.getStructure);
router.post('/structure', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.CREATE_FEE), validate(createFeeStructureSchema), feeController.createStructure);

router.get('/installments', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.READ_FEE), feeController.getInstallments);
router.post('/installments', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.CREATE_FEE), validate(createInstallmentSchema), feeController.createInstallment);
router.patch('/installments/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.UPDATE_FEE), validate(updateInstallmentSchema), feeController.updateInstallment);
router.delete('/installments/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.DELETE_FEE), feeController.deleteInstallment);

router.get('/analytics', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.READ_ANALYTICS), feeController.getFeeAnalytics);

export default router;
