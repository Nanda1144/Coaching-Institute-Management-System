import { z } from 'zod';

export const submissionQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
  assignmentId: z.string().uuid().optional(),
  studentId: z.string().uuid().optional(),
  status: z.enum(['submitted', 'late', 'resubmitted', 'graded', 'returned']).optional(),
});

export const gradeSubmissionSchema = z.object({
  marksObtained: z.number().positive('Marks obtained must be positive'),
  totalMarks: z.number().int().positive('Total marks must be positive'),
  grade: z.string().optional(),
  feedback: z.string().optional(),
  remarks: z.string().optional(),
});

export type SubmissionQueryInput = z.infer<typeof submissionQuerySchema>;
export type GradeSubmissionInput = z.infer<typeof gradeSubmissionSchema>;
