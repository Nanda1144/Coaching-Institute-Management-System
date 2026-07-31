import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import { sendSuccess, sendCreated, sendError } from '../../shared/utils/api-response';
import { IAuthRequest } from '../../shared/middleware/auth.middleware';
import { subscriptionService } from './subscription.service';

export const subscriptionController = {
  getPlans: asyncHandler(async (req: Request, res: Response) => {
    const plans = await subscriptionService.getPlans();
    sendSuccess(res, plans, 'Plans retrieved successfully');
  }),

  getMySubscription: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const sub = await subscriptionService.getMySubscription(req.user!.id);
    sendSuccess(res, sub, 'Subscription retrieved successfully');
  }),

  getStatus: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const status = await subscriptionService.getStatus(req.user!.id);
    sendSuccess(res, status, 'Status retrieved successfully');
  }),

  createOrGetTrial: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const sub = await subscriptionService.createOrGetTrial(req.user!.id);
    sendCreated(res, sub, 'Trial subscription activated');
  }),

  subscribe: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { planId } = req.body;
    const sub = await subscriptionService.subscribe(req.user!.id, planId);
    sendSuccess(res, sub, 'Subscribed successfully');
  }),

  createRazorpayOrder: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { planId } = req.body;
    const result = await subscriptionService.createRazorpayOrder(req.user!.id, planId);
    sendSuccess(res, result, 'Razorpay order created');
  }),

  verifyRazorpayPayment: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, planId } = req.body;
    const sub = await subscriptionService.verifyAndActivate(req.user!.id, {
      razorpayOrderId, razorpayPaymentId, razorpaySignature, planId,
    });
    sendSuccess(res, sub, 'Payment verified and subscription activated');
  }),

  createPhonePeOrder: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { planId, callbackUrl } = req.body;
    const result = await subscriptionService.createPhonePeOrder(req.user!.id, planId, callbackUrl);
    sendSuccess(res, result, 'PhonePe order created');
  }),

  verifyPhonePePayment: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { merchantTransactionId, planId } = req.body;
    const result = await subscriptionService.verifyPhonePePayment(merchantTransactionId);
    if (result.success) {
      await subscriptionService.subscribe(req.user!.id, planId);
    }
    sendSuccess(res, result, 'Payment verified and subscription activated');
  }),

  phonepeCallback: asyncHandler(async (req: IAuthRequest, res: Response) => {
    const frontendUrl = process.env.CORS_ORIGIN || 'http://localhost:5173';
    const { planId, adminId } = req.query as { planId?: string; adminId?: string };
    try {
      let merchantTransactionId = '';
      if (req.body?.response) {
        const decoded = JSON.parse(Buffer.from(req.body.response, 'base64').toString());
        merchantTransactionId = decoded?.data?.merchantTransactionId || '';
      }
      if (!merchantTransactionId && req.body?.merchantTransactionId) {
        merchantTransactionId = req.body.merchantTransactionId;
      }
      if (!merchantTransactionId || !planId || !adminId) {
        res.redirect(`${frontendUrl}/dashboard/subscription?payment=failed`);
        return;
      }
      const result = await subscriptionService.verifyPhonePePayment(merchantTransactionId);
      if (result.success) {
        await subscriptionService.subscribe(adminId, planId);
        res.redirect(`${frontendUrl}/dashboard/subscription?payment=success`);
      } else {
        res.redirect(`${frontendUrl}/dashboard/subscription?payment=failed`);
      }
    } catch {
      res.redirect(`${frontendUrl}/dashboard/subscription?payment=failed`);
    }
  }),
};
