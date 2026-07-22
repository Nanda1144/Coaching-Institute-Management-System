import { z } from 'zod';

export const createCertificateSchema = z.object({
  body: z.object({
    studentId: z.string().uuid(),
    studentName: z.string().min(1),
    courseName: z.string().min(1),
    completionDate: z.string().optional(),
    grade: z.string().optional(),
    templateName: z.string().default('Standard'),
    templateStyle: z.enum(['classic', 'modern', 'minimal']).default('classic'),
    issueDate: z.string().optional(),
  }),
});

export const updateCertificateSchema = z.object({
  body: z.object({
    studentName: z.string().optional(),
    courseName: z.string().optional(),
    completionDate: z.string().optional(),
    grade: z.string().optional(),
    templateName: z.string().optional(),
    templateStyle: z.enum(['classic', 'modern', 'minimal']).optional(),
    status: z.enum(['active', 'revoked']).optional(),
  }),
});

export const certificateQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.string().optional(),
  studentId: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional(),
});
