import { z } from 'zod';

export const createHomeworkSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  departmentId: z.string().min(1, 'Department is required'),
  courseId: z.string().min(1, 'Course is required'),
  batchId: z.string().min(1, 'Batch is required'),
  subjectId: z.string().min(1, 'Subject is required'),
  facultyId: z.string().min(1, 'Faculty is required'),
  dueDate: z.coerce.date(),
  status: z.enum(['active', 'closed', 'cancelled', 'archived']).optional().default('active'),
});

export const updateHomeworkSchema = createHomeworkSchema.partial();

export const homeworkQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  subjectId: z.string().optional(),
  batchId: z.string().optional(),
  facultyId: z.string().optional(),
  status: z.enum(['active', 'closed', 'cancelled', 'archived']).optional(),
});

export type CreateHomeworkInput = z.infer<typeof createHomeworkSchema>;
export type UpdateHomeworkInput = z.infer<typeof updateHomeworkSchema>;
export type HomeworkQueryInput = z.infer<typeof homeworkQuerySchema>;
