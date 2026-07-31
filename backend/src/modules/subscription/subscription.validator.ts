import { z } from 'zod';

export const subscribeSchema = z.object({
  planId: z.string().min(1, 'Plan ID is required'),
});

export const razorpayOrderSchema = z.object({
  planId: z.string().min(1, 'Plan ID is required'),
});

export const razorpayVerifySchema = z.object({
  razorpayOrderId: z.string().min(1, 'Order ID is required'),
  razorpayPaymentId: z.string().min(1, 'Payment ID is required'),
  razorpaySignature: z.string().min(1, 'Signature is required'),
  planId: z.string().min(1, 'Plan ID is required'),
});

export const phonepeOrderSchema = z.object({
  planId: z.string().min(1, 'Plan ID is required'),
  callbackUrl: z.string().url('Valid callback URL is required'),
});

export const phonepeVerifySchema = z.object({
  merchantTransactionId: z.string().min(1, 'Transaction ID is required'),
  planId: z.string().min(1, 'Plan ID is required'),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;
