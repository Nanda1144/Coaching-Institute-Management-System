import { z } from 'zod';

export const uploadCloudSchema = z.object({
  body: z.object({
    documentType: z.string().min(1),
    studentId: z.string().uuid(),
  }),
});

export const cloudDocumentQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    studentId: z.string().optional(),
    documentType: z.string().optional(),
    cloudProvider: z.string().optional(),
  }),
});

export const cloudDocumentIdSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

export const deleteCloudDocSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});
