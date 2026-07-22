import { z } from 'zod';

export const createPaymentSchema = z.object({
  body: z.object({
    studentId: z.string().uuid(),
    studentFeeId: z.string().uuid().optional(),
    amount: z.number().positive(),
    gateway: z.enum(['razorpay', 'phonepe', 'stripe', 'cash', 'cheque', 'bank_transfer']),
    currency: z.string().length(3).default('INR'),
    paymentMethod: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const updatePaymentSchema = z.object({
  body: z.object({
    status: z.enum(['created', 'pending', 'paid', 'failed', 'refunded']).optional(),
    gatewayPaymentId: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const processRefundSchema = z.object({
  body: z.object({
    reason: z.string().min(1, 'Refund reason is required'),
    amount: z.number().positive().optional(),
  }),
});

export const paymentQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.string().optional(),
  gateway: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional(),
});
