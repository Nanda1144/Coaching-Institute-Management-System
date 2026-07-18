import { z } from 'zod';

export const createAttendanceSchema = z.object({
  studentId: z.string().uuid(),
  subjectId: z.string().uuid(),
  batchId: z.string().uuid(),
  classroomId: z.string().uuid().optional(),
  attendanceDate: z.string().datetime(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  attendanceMethod: z.enum(['manual', 'face_recognition', 'fingerprint', 'qr_code']),
  attendanceStatus: z.enum(['present', 'absent', 'late', 'half_day', 'leave']),
  remarks: z.string().optional(),
});

export const updateAttendanceSchema = createAttendanceSchema.partial();

export const attendanceQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  facultyId: z.string().uuid().optional(),
  subjectId: z.string().uuid().optional(),
  batchId: z.string().uuid().optional(),
  date: z.string().datetime().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  status: z.enum(['present', 'absent', 'late', 'half_day', 'leave']).optional(),
  method: z.enum(['manual', 'face_recognition', 'fingerprint', 'qr_code']).optional(),
});

export const faceRecognitionSchema = z.object({
  sessionId: z.string().min(1),
  studentId: z.string().uuid(),
  imageUrl: z.string().url().optional(),
  confidence: z.number().min(0).max(1),
  deviceId: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const fingerprintSchema = z.object({
  sessionId: z.string().min(1),
  fingerprintId: z.string().min(1),
  studentId: z.string().uuid(),
  scannerId: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const qrSessionSchema = z.object({
  subjectId: z.string().uuid(),
  batchId: z.string().uuid(),
  classroomId: z.string().uuid().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
});

export const qrScanSchema = z.object({
  qrToken: z.string().min(1),
  studentId: z.string().uuid(),
});

export const correctionSchema = z.object({
  attendanceId: z.string().uuid(),
  requestedStatus: z.enum(['present', 'absent', 'late', 'half_day', 'leave']),
  reason: z.string().min(1, 'Reason is required'),
  attachmentUrl: z.string().url().optional(),
});

export const createFaceRecognitionSessionSchema = z.object({
  studentId: z.string().uuid(),
  confidence: z.number().min(0).max(1).optional().default(0),
  imageUrl: z.string().url().optional(),
  deviceId: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const createFingerprintSessionSchema = z.object({
  fingerprintId: z.string().min(1),
  studentId: z.string().uuid(),
  scannerId: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type CreateAttendanceInput = z.infer<typeof createAttendanceSchema>;
export type UpdateAttendanceInput = z.infer<typeof updateAttendanceSchema>;
export type AttendanceQueryInput = z.infer<typeof attendanceQuerySchema>;
export type FaceRecognitionInput = z.infer<typeof faceRecognitionSchema>;
export type CreateFaceRecognitionSessionInput = z.infer<typeof createFaceRecognitionSessionSchema>;
export type CreateFingerprintSessionInput = z.infer<typeof createFingerprintSessionSchema>;
export type FingerprintInput = z.infer<typeof fingerprintSchema>;
export type QRSessionInput = z.infer<typeof qrSessionSchema>;
export type QRScanInput = z.infer<typeof qrScanSchema>;
export type CorrectionInput = z.infer<typeof correctionSchema>;
