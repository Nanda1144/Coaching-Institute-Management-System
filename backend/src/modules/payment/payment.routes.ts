import { Router } from 'express';
import { authenticate, authorize, requirePermission } from '../../shared/middleware/auth.middleware';
import { UserRole, Permission } from '../../shared/enums';
import { validate } from '../../shared/middleware/validate.middleware';
import { paymentController } from './payment.controller';
import { createPaymentSchema, updatePaymentSchema, paymentQuerySchema, processRefundSchema } from './payment.validator';

const router = Router();

router.get('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.READ_PAYMENT), validate(paymentQuerySchema, 'query'), paymentController.getAll);
router.get('/history', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.READ_PAYMENT), paymentController.getHistory);
router.get('/summary', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.READ_PAYMENT), paymentController.getSummary);
router.get('/student/:studentId', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.FACULTY), requirePermission(Permission.READ_PAYMENT), paymentController.getByStudent);
router.get('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.READ_PAYMENT), paymentController.getById);
router.post('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.CREATE_PAYMENT), validate(createPaymentSchema), paymentController.create);
router.patch('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.UPDATE_PAYMENT), validate(updatePaymentSchema), paymentController.update);
router.delete('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.DELETE_PAYMENT), paymentController.delete);
router.post('/:id/refund', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), requirePermission(Permission.PROCESS_REFUND), validate(processRefundSchema), paymentController.processRefund);

export default router;
