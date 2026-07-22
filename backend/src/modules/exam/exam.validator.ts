import { z } from 'zod';

export const createExamSchema = z.object({
  title: z.string().min(1).max(200),
  subject: z.string().min(1),
  batch: z.string().min(1),
  date: z.coerce.date(),
  time: z.string().optional(),
  maxMarks: z.number().int().positive().optional(),
  type: z.string().optional(),
  location: z.string().optional(),
  status: z.string().optional().default('scheduled'),
});

export const updateExamSchema = createExamSchema.partial();

export const examQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  search: z.string().optional(),
  status: z.string().optional(),
});

export type CreateExamInput = z.infer<typeof createExamSchema>;
export type UpdateExamInput = z.infer<typeof updateExamSchema>;
export type ExamQueryInput = z.infer<typeof examQuerySchema>;
