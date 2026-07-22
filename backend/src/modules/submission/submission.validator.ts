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

export const createSubmissionSchema = z.object({
  assignmentId: z.string().uuid('Assignment ID must be a valid UUID'),
  studentId: z.string().uuid('Student ID must be a valid UUID'),
  attemptNumber: z.number().int().positive().optional().default(1),
  status: z.enum(['submitted', 'late', 'resubmitted']).optional().default('submitted'),
  remarks: z.string().optional(),
  lateFlag: z.boolean().optional().default(false),
});

export const updateSubmissionSchema = z.object({
  status: z.enum(['submitted', 'late', 'resubmitted', 'graded', 'returned']).optional(),
  remarks: z.string().optional(),
  attemptNumber: z.number().int().positive().optional(),
  lateFlag: z.boolean().optional(),
});

export type SubmissionQueryInput = z.infer<typeof submissionQuerySchema>;
export type GradeSubmissionInput = z.infer<typeof gradeSubmissionSchema>;
export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;
export type UpdateSubmissionInput = z.infer<typeof updateSubmissionSchema>;
