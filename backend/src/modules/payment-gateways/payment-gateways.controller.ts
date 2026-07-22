import { Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { sendSuccess, sendCreated } from '../../shared/utils/api-response';
import { AppError } from '../../shared/errors/AppError';
import { paymentGatewayService } from './payment-gateways.service';

export const paymentGatewayController = {
  // Razorpay
  razorpayCreateOrder: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { amount, currency, receipt, studentId, description } = req.body;
    const result = await paymentGatewayService.razorpayCreateOrder(amount, currency, receipt, studentId, description);
    sendCreated(res, result, 'Razorpay order created');
  }),

  razorpayVerify: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { orderId, paymentId, signature } = req.body;
    const result = await paymentGatewayService.razorpayVerify(orderId, paymentId, signature);
    sendSuccess(res, result, 'Payment verified');
  }),

  // PhonePe
  phonepeInitiate: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { amount, merchantUserId, callbackUrl, studentId, description } = req.body;
    const result = await paymentGatewayService.phonepeInitiate(amount, merchantUserId, callbackUrl, studentId, description);
    sendCreated(res, result, 'PhonePe payment initiated');
  }),

  phonepeVerify: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { merchantTransactionId } = req.body;
    const result = await paymentGatewayService.phonepeVerify(merchantTransactionId);
    sendSuccess(res, result, 'PhonePe payment verified');
  }),

  // Stripe
  stripeCreateIntent: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { amount, currency, studentId, description } = req.body;
    const result = await paymentGatewayService.stripeCreateIntent(amount, currency, studentId, description);
    sendCreated(res, result, 'Stripe payment intent created');
  }),

  stripeWebhook: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;
    const { stripeGateway } = require('../../services/gateways/stripe');
    try {
      stripeGateway.constructWebhookEvent(req.body, sig);
    } catch (err: any) {
      throw AppError.badRequest(`Webhook Error: ${err.message}`);
    }
    res.json({ received: true });
  }),

  // History
  getHistory: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const data = await paymentGatewayService.getHistory(req.query as any);
    sendSuccess(res, data, 'Payment history retrieved');
  }),

  getByGatewayOrderId: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const payment = await paymentGatewayService.getPaymentByGatewayOrderId(req.params.gatewayOrderId);
    if (!payment) throw AppError.notFound('Payment not found');
    sendSuccess(res, payment, 'Payment retrieved');
  }),
};
