import { z } from 'zod';

export const createAssignmentSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  instructions: z.string().optional(),
  departmentId: z.string().uuid(),
  courseId: z.string().uuid(),
  semesterId: z.string().uuid(),
  subjectId: z.string().uuid(),
  batchId: z.string().uuid(),
  facultyId: z.string().uuid(),
  totalMarks: z.number().int().positive(),
  passingMarks: z.number().int().positive(),
  publishDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  dueTime: z.coerce.date(),
  allowLateSubmission: z.boolean().optional().default(false),
  maxFileSize: z.number().int().positive().optional(),
  maxAttempts: z.number().int().positive().optional().default(1),
  visibility: z.enum(['visible', 'hidden', 'draft']).optional().default('visible'),
  status: z.enum(['active', 'closed', 'cancelled', 'archived']).optional().default('active'),
});

export const updateAssignmentSchema = createAssignmentSchema.partial();

export const assignmentQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  subjectId: z.string().optional(),
  batchId: z.string().optional(),
  facultyId: z.string().optional(),
  status: z.enum(['active', 'closed', 'cancelled', 'archived']).optional(),
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
export type UpdateAssignmentInput = z.infer<typeof updateAssignmentSchema>;
export type AssignmentQueryInput = z.infer<typeof assignmentQuerySchema>;
