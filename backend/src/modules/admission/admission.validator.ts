import { z } from 'zod';

export const createAdmissionSchema = z.object({
  body: z.object({
    admissionNumber: z.string().min(1, 'Admission number is required'),
    firstName: z.string().min(2).max(100),
    lastName: z.string().min(2).max(100),
    email: z.string().email(),
    mobileNumber: z.string().regex(/^\d{10}$/, '10-digit mobile number required'),
    dateOfBirth: z.string().optional(),
    qualification: z.string().optional(),
    courseId: z.string().uuid('Invalid course ID'),
    batchId: z.string().uuid('Invalid batch ID'),
    admissionDate: z.string().refine((v) => !isNaN(Date.parse(v)), 'Invalid date'),
    status: z.enum(['active', 'inactive', 'completed', 'dropped']).optional(),
  }),
});

export const updateAdmissionSchema = z.object({
  body: z.object({
    admissionNumber: z.string().optional(),
    firstName: z.string().min(2).max(100).optional(),
    lastName: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
    mobileNumber: z.string().regex(/^\d{10}$/).optional(),
    dateOfBirth: z.string().optional(),
    qualification: z.string().optional(),
    courseId: z.string().uuid().optional(),
    batchId: z.string().uuid().optional(),
    admissionDate: z.string().optional(),
    status: z.enum(['active', 'inactive', 'completed', 'dropped']).optional(),
  }),
});

export const admissionIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid admission ID'),
  }),
});

export const eligibilityCheckSchema = z.object({
  body: z.object({
    courseId: z.string().uuid('Invalid course ID'),
    dateOfBirth: z.string().optional(),
    qualification: z.string().optional(),
    studentId: z.string().optional(),
  }),
});

export const enrollmentSchema = z.object({
  body: z.object({
    admissionNumber: z.string().min(1),
    firstName: z.string().min(2).max(100),
    lastName: z.string().min(2).max(100),
    email: z.string().email(),
    mobileNumber: z.string().regex(/^\d{10}$/),
    dateOfBirth: z.string(),
    qualification: z.string(),
    courseId: z.string().uuid(),
    batchId: z.string().uuid(),
    admissionDate: z.string(),
  }),
});

export const admQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    status: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['ASC', 'DESC']).optional(),
  }),
});
