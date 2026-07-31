import { Router } from 'express';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { UserRole } from '../../shared/enums';
import { validate } from '../../shared/middleware/validate.middleware';
import { subscriptionController } from './subscription.controller';
import { subscribeSchema, razorpayOrderSchema, razorpayVerifySchema, phonepeOrderSchema, phonepeVerifySchema } from './subscription.validator';

const router = Router();

router.get('/plans', subscriptionController.getPlans);
router.get('/my', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), subscriptionController.getMySubscription);
router.get('/status', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), subscriptionController.getStatus);
router.post('/trial', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), subscriptionController.createOrGetTrial);
router.post('/subscribe', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(subscribeSchema), subscriptionController.subscribe);
router.post('/create-razorpay-order', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(razorpayOrderSchema), subscriptionController.createRazorpayOrder);
router.post('/verify-razorpay-payment', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(razorpayVerifySchema), subscriptionController.verifyRazorpayPayment);
router.post('/create-phonepe-order', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(phonepeOrderSchema), subscriptionController.createPhonePeOrder);
router.post('/verify-phonepe-payment', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(phonepeVerifySchema), subscriptionController.verifyPhonePePayment);
router.post('/phonepe-callback', subscriptionController.phonepeCallback);

export default router;
