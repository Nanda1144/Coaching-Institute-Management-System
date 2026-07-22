import { z } from 'zod';

export const createFeeTransactionSchema = z.object({
  student: z.string().min(1),
  roll: z.string().min(1),
  description: z.string().min(1),
  amount: z.number().int().positive(),
  date: z.coerce.date().optional(),
  method: z.string().optional(),
  status: z.string().optional().default('paid'),
});

export const updateFeeTransactionSchema = createFeeTransactionSchema.partial();

export const createFeePendingSchema = z.object({
  student: z.string().min(1),
  roll: z.string().min(1),
  amount: z.number().int().positive(),
  dueDate: z.coerce.date(),
  daysOverdue: z.number().int().min(0).optional().default(0),
});

export const createFeeStructureSchema = z.object({
  type: z.string().min(1),
  amount: z.number().int().positive(),
  dueDate: z.string().min(1),
  semester: z.string().optional(),
  courseId: z.string().uuid().optional(),
  batchId: z.string().uuid().optional(),
  academicYear: z.string().optional(),
  registrationFee: z.number().positive().optional(),
  tuitionFee: z.number().positive().optional(),
  examinationFee: z.number().positive().optional(),
  miscellaneousFee: z.number().positive().optional(),
  totalFee: z.number().positive().optional(),
  installmentCount: z.number().int().min(1).max(24).optional().default(1),
});

export const createInstallmentSchema = z.object({
  body: z.object({
    feeStructureId: z.string().uuid(),
    installmentNumber: z.number().int().positive(),
    dueDate: z.coerce.date(),
    amount: z.number().positive(),
    status: z.enum(['pending', 'paid', 'overdue']).optional().default('pending'),
    paidDate: z.coerce.date().optional(),
  }),
});

export const updateInstallmentSchema = z.object({
  body: z.object({
    installmentNumber: z.number().int().positive().optional(),
    dueDate: z.coerce.date().optional(),
    amount: z.number().positive().optional(),
    status: z.enum(['pending', 'paid', 'overdue']).optional(),
    paidDate: z.coerce.date().optional(),
  }),
});

export const installmentIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const feeQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  roll: z.string().optional(),
  status: z.string().optional(),
});

export type CreateFeeTransactionInput = z.infer<typeof createFeeTransactionSchema>;
export type UpdateFeeTransactionInput = z.infer<typeof updateFeeTransactionSchema>;
export type CreateFeePendingInput = z.infer<typeof createFeePendingSchema>;
export type CreateFeeStructureInput = z.infer<typeof createFeeStructureSchema>;
export type FeeQueryInput = z.infer<typeof feeQuerySchema>;
