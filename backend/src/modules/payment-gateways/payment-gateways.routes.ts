import { Router } from 'express';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { UserRole } from '../../shared/enums';
import { validate } from '../../shared/middleware/validate.middleware';
import { paymentGatewayController } from './payment-gateways.controller';
import {
  razorpayOrderSchema,
  razorpayVerifySchema,
  phonepeInitiateSchema,
  phonepeVerifySchema,
  stripeIntentSchema,
} from './payment-gateways.validator';

const router = Router();

// Razorpay
router.post('/razorpay/create-order', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(razorpayOrderSchema), paymentGatewayController.razorpayCreateOrder);
router.post('/razorpay/verify', authenticate, validate(razorpayVerifySchema), paymentGatewayController.razorpayVerify);

// PhonePe
router.post('/phonepe/initiate', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(phonepeInitiateSchema), paymentGatewayController.phonepeInitiate);
router.post('/phonepe/verify', authenticate, validate(phonepeVerifySchema), paymentGatewayController.phonepeVerify);

// Stripe
router.post('/stripe/create-payment-intent', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(stripeIntentSchema), paymentGatewayController.stripeCreateIntent);
router.post('/stripe/webhook', paymentGatewayController.stripeWebhook);

// History
router.get('/history', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD), paymentGatewayController.getHistory);
router.get('/lookup/:gatewayOrderId', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), paymentGatewayController.getByGatewayOrderId);

export default router;
