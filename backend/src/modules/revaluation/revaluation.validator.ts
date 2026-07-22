import { z } from 'zod';

export const createRevaluationSchema = z.object({
  body: z.object({
    examId: z.string().uuid(),
    studentId: z.string().uuid(),
    subjectId: z.string().uuid().optional(),
    currentMarks: z.number().positive(),
    expectedMarks: z.number().positive(),
    reason: z.string().min(10).max(1000),
  }),
});

export const updateRevaluationSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'approved', 'rejected', 'in_review']),
    reviewedById: z.string().uuid().optional(),
    reviewedAt: z.string().optional(),
    remarks: z.string().max(1000).optional(),
    revisedMarks: z.number().positive().optional(),
  }),
});

export const revaluationIdSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

export const revaluationQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.string().optional(),
    examId: z.string().optional(),
    studentId: z.string().optional(),
  }),
});
