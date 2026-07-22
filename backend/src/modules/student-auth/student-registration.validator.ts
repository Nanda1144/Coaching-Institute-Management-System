import { z } from 'zod';

export const studentRegistrationSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(20).optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  gender: z.string().optional(),
  dateOfBirth: z.coerce.date().optional(),
  address: z.any().optional(),
  department: z.string().min(1),
  course: z.string().optional(),
  semester: z.coerce.number().int().positive().optional(),
  batch: z.string().optional(),
  preferredFacultyId: z.string().optional(),
  parentName: z.string().optional(),
  parentEmail: z.string().email().optional().or(z.literal('')),
  parentPhone: z.string().optional(),
  documents: z.array(z.any()).optional(),
});

export const registrationApprovalSchema = z.object({
  status: z.enum(['APPROVED', 'HOLD', 'REJECTED']),
  remarks: z.string().optional(),
  batchId: z.string().optional(),
  batch: z.string().optional(),
  joiningDate: z.coerce.date().optional(),
});

export type StudentRegistrationInput = z.infer<typeof studentRegistrationSchema>;
export type RegistrationApprovalInput = z.infer<typeof registrationApprovalSchema>;
