import { z } from 'zod';

export const razorpayOrderSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
    currency: z.string().optional(),
    receipt: z.string().optional(),
    studentId: z.string().uuid().optional(),
    description: z.string().optional(),
  }),
});

export const razorpayVerifySchema = z.object({
  body: z.object({
    orderId: z.string(),
    paymentId: z.string(),
    signature: z.string(),
  }),
});

export const phonepeInitiateSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
    merchantUserId: z.string(),
    callbackUrl: z.string(),
    studentId: z.string().uuid().optional(),
    description: z.string().optional(),
  }),
});

export const phonepeVerifySchema = z.object({
  body: z.object({
    merchantTransactionId: z.string(),
  }),
});

export const stripeIntentSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
    currency: z.string().optional(),
    studentId: z.string().uuid().optional(),
    description: z.string().optional(),
  }),
});
