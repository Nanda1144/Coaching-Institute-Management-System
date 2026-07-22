import { z } from 'zod';

export const createMaterialSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  departmentId: z.string().min(1, 'Department is required'),
  courseId: z.string().min(1, 'Course is required'),
  semesterId: z.string().min(1, 'Semester is required'),
  subjectId: z.string().min(1, 'Subject is required'),
  chapterId: z.string().optional(),
  batchId: z.string().min(1, 'Batch is required'),
  categoryId: z.string().optional(),
  materialType: z.enum(['PDF', 'PPT', 'PPTX', 'DOC', 'DOCX', 'IMAGE', 'VIDEO', 'ZIP', 'NOTES']),
  visibility: z.enum(['PUBLIC', 'FACULTY_ONLY', 'STUDENTS_ONLY', 'BATCH_ONLY']).default('PUBLIC'),
  fileName: z.string().min(1, 'File name is required'),
  originalFileName: z.string().min(1, 'Original file name is required'),
  fileUrl: z.string().min(1, 'File URL is required'),
  fileExtension: z.string().min(1, 'File extension is required'),
  mimeType: z.string().min(1, 'MIME type is required'),
  fileSize: z.number().int().positive('File size must be positive'),
  thumbnailUrl: z.string().optional(),
  contentHash: z.string().optional(),
  isPublic: z.boolean().default(true),
});

export const updateMaterialSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  subjectId: z.string().min(1).optional(),
  chapterId: z.string().optional(),
  batchId: z.string().min(1).optional(),
  categoryId: z.string().optional(),
  materialType: z.enum(['PDF', 'PPT', 'PPTX', 'DOC', 'DOCX', 'IMAGE', 'VIDEO', 'ZIP', 'NOTES']).optional(),
  visibility: z.enum(['PUBLIC', 'FACULTY_ONLY', 'STUDENTS_ONLY', 'BATCH_ONLY']).optional(),
  fileName: z.string().min(1).optional(),
  originalFileName: z.string().min(1).optional(),
  fileUrl: z.string().min(1).optional(),
  fileExtension: z.string().min(1).optional(),
  mimeType: z.string().min(1).optional(),
  fileSize: z.number().int().positive().optional(),
  thumbnailUrl: z.string().optional(),
  contentHash: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export const materialQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  subjectId: z.string().optional(),
  batchId: z.string().optional(),
  categoryId: z.string().optional(),
  type: z.enum(['PDF', 'PPT', 'PPTX', 'DOC', 'DOCX', 'IMAGE', 'VIDEO', 'ZIP', 'NOTES']).optional(),
  search: z.string().optional(),
  departmentId: z.string().optional(),
  courseId: z.string().optional(),
  semesterId: z.string().optional(),
});

export const recordDownloadSchema = z.object({
  ipAddress: z.string().optional(),
  deviceInfo: z.string().optional(),
  userAgent: z.string().optional(),
});

export type CreateMaterialInput = z.infer<typeof createMaterialSchema>;
export type UpdateMaterialInput = z.infer<typeof updateMaterialSchema>;
export type MaterialQueryInput = z.infer<typeof materialQuerySchema>;
export type RecordDownloadInput = z.infer<typeof recordDownloadSchema>;
