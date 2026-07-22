import { z } from 'zod';

export const createEnrollmentSchema = z.object({
  body: z.object({
    studentId: z.string().uuid('Invalid student ID'),
    courseId: z.string().uuid('Invalid course ID'),
    enrollmentDate: z.string().optional(),
    status: z.enum(['enrolled', 'completed', 'dropped']).optional(),
  }),
});

export const enrollmentIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid enrollment ID'),
  }),
});

export const enrollmentQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.string().optional(),
    studentId: z.string().optional(),
    courseId: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['ASC', 'DESC']).optional(),
  }),
});
