import { z } from 'zod';

export const createParentSchema = z.object({
  fullName: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().optional(),
  linkedStudent: z.string().optional(),
  linkedRoll: z.string().optional(),
  relationship: z.string().optional(),
  password: z.string().optional(),
  role: z.string().optional(),
  status: z.string().optional(),
});

export const updateParentSchema = createParentSchema.partial();

export const parentQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  search: z.string().optional(),
  status: z.string().optional(),
});

export const linkStudentSchema = z.object({
  body: z.object({
    studentId: z.string().uuid(),
    relationship: z.string().optional(),
  }),
});

export const unlinkStudentSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
    studentId: z.string().uuid(),
  }),
});

export const notificationPrefsSchema = z.object({
  body: z.record(z.boolean()).optional(),
});
