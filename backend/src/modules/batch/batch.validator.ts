import { z } from 'zod';

export const createBatchSchema = z.object({
  batchName: z.string().min(3).max(200).optional(),
  name: z.string().min(3).max(200).optional(),
  batchCode: z.string().min(2).max(20).optional(),
  department: z.string().optional(),
  course: z.string().optional(),
  courseId: z.string().uuid().optional(),
  semester: z.number().int().min(1).max(12).optional(),
  year: z.string().optional(),
  academicYear: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  schedule: z.string().max(100).optional(),
  batchTiming: z.string().max(100).optional(),
  classroom: z.string().max(100).optional(),
  mode: z.enum(['online', 'offline', 'hybrid']).optional(),
  facultyId: z.string().uuid().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.enum(['active', 'completed', 'upcoming']).optional(),
});

export const updateBatchSchema = z.object({
  batchName: z.string().min(3).max(200).optional(),
  batchCode: z.string().min(2).max(20).optional(),
  department: z.string().optional(),
  course: z.string().optional(),
  courseId: z.string().uuid().optional(),
  semester: z.number().int().min(1).max(12).optional(),
  academicYear: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  batchTiming: z.string().max(100).optional(),
  classroom: z.string().max(100).optional(),
  mode: z.enum(['online', 'offline', 'hybrid']).optional(),
  facultyId: z.string().uuid().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.enum(['active', 'completed', 'upcoming']).optional(),
});

export const batchIdSchema = z.object({
  id: z.string().uuid(),
});

export const batchQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  status: z.string().optional(),
  mode: z.string().optional(),
  courseId: z.string().optional(),
  facultyId: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional(),
});

export const allocateStudentSchema = z.object({
  batchId: z.string().uuid(),
  studentId: z.string().uuid(),
});

export const deallocateStudentSchema = z.object({
  batchId: z.string().uuid(),
  studentId: z.string().uuid(),
});

export const assignFacultySchema = z.object({
  batchId: z.string().uuid(),
  facultyId: z.string().uuid(),
});

export const transferStudentSchema = z.object({
  studentId: z.string().uuid(),
  oldBatchId: z.string().uuid(),
  newBatchId: z.string().uuid(),
  reason: z.string().max(500).optional(),
});

export const validateCapacitySchema = z.object({
  id: z.string().uuid(),
  count: z.number().int().positive().default(1),
});
