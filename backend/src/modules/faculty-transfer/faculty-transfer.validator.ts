import { z } from 'zod';

export const createFacultyTransferSchema = z.object({
  facultyId: z.string().uuid(),
  fromBranch: z.string().min(1),
  fromDepartment: z.string().min(1),
  toBranch: z.string().min(1),
  toDepartment: z.string().min(1),
  transferDate: z.coerce.date(),
  reason: z.string().min(1),
});

export const updateFacultyTransferStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']),
});

export const facultyTransferQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  facultyId: z.string().uuid().optional(),
});

export type CreateFacultyTransferInput = z.infer<typeof createFacultyTransferSchema>;
export type UpdateFacultyTransferStatusInput = z.infer<typeof updateFacultyTransferStatusSchema>;
export type FacultyTransferQueryInput = z.infer<typeof facultyTransferQuerySchema>;
