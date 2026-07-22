import { z } from 'zod';

export const createEvaluationSchema = z.object({
  submissionId: z.string().uuid('Invalid submission ID'),
  facultyId: z.string().uuid('Invalid faculty ID'),
  marksObtained: z.number().positive('Marks obtained must be positive'),
  totalMarks: z.number().int().positive('Total marks must be positive'),
  grade: z.string().optional(),
  feedback: z.string().optional(),
  remarks: z.string().optional(),
});

export const updateEvaluationSchema = z.object({
  marksObtained: z.number().positive('Marks obtained must be positive').optional(),
  totalMarks: z.number().int().positive('Total marks must be positive').optional(),
  grade: z.string().optional(),
  feedback: z.string().optional(),
  remarks: z.string().optional(),
});

export const evaluationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
  facultyId: z.string().uuid().optional(),
  status: z.enum(['draft', 'published', 'under_review', 'revised']).optional(),
  submissionId: z.string().uuid().optional(),
});

export type CreateEvaluationInput = z.infer<typeof createEvaluationSchema>;
export type UpdateEvaluationInput = z.infer<typeof updateEvaluationSchema>;
export type EvaluationQueryInput = z.infer<typeof evaluationQuerySchema>;
