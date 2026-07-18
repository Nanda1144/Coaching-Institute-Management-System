import { z } from 'zod';

export const uploadFileSchema = z.object({
  module: z.string().optional(),
  moduleId: z.string().optional(),
});

export const uploadQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
});

export type UploadFileInput = z.infer<typeof uploadFileSchema>;
export type UploadQueryInput = z.infer<typeof uploadQuerySchema>;
