import { z } from 'zod';

export const createScholarshipSchema = z.object({
  body: z.object({
    studentId: z.string().uuid(),
    scholarshipName: z.string().min(1).max(200),
    type: z.enum(['merit', 'need', 'sports', 'other']),
    amount: z.number().positive(),
    percentage: z.number().min(0).max(100).optional(),
    startDate: z.string(),
    endDate: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
    description: z.string().max(1000).optional(),
  }),
});

export const updateScholarshipSchema = z.object({
  body: z.object({
    scholarshipName: z.string().min(1).max(200).optional(),
    type: z.enum(['merit', 'need', 'sports', 'other']).optional(),
    amount: z.number().positive().optional(),
    percentage: z.number().min(0).max(100).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
    description: z.string().max(1000).optional(),
  }),
});

export const scholarshipIdSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

export const scholarshipQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.string().optional(),
    type: z.string().optional(),
    studentId: z.string().optional(),
  }),
});
