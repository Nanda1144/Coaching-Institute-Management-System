import { z } from 'zod';

export const createStudentSchema = z.object({
  fullName: z.string().min(1).max(200),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  phoneNumber: z.string().optional(),
  rollNumber: z.string().min(1),
  department: z.string().min(1),
  course: z.string().optional(),
  year: z.coerce.number().int().positive().optional(),
  semester: z.coerce.number().int().positive().optional(),
  batch: z.string().min(1),
  batchId: z.string().uuid().optional(),
  section: z.string().optional(),
  gender: z.string().optional(),
  dateOfBirth: z.coerce.date().optional(),
  dob: z.coerce.date().optional(),
  address: z.any().optional(),
  status: z.string().optional().default('active'),
});

export const updateStudentSchema = createStudentSchema.partial();

export const studentQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  search: z.string().optional(),
  department: z.string().optional(),
  batchId: z.string().optional(),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type StudentQueryInput = z.infer<typeof studentQuerySchema>;
