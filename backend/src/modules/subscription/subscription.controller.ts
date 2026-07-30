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
};
