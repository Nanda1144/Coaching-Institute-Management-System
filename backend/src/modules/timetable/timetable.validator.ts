import { z } from 'zod';

export const timetableQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  facultyId: z.string().optional(),
  dayOfWeek: z.string().optional(),
  department: z.string().optional(),
  semester: z.coerce.number().int().positive().optional(),
});

export type TimetableQueryInput = z.infer<typeof timetableQuerySchema>;

export const createTimetableSchema = z.object({
  timetableId: z.string().optional(),
  academicYear: z.string().min(1),
  semester: z.coerce.number().int().positive(),
  department: z.string().min(1),
  course: z.string().min(1),
  batch: z.string().min(1),
  section: z.string().optional(),
  subject: z.string().min(1),
  subjectCode: z.string().min(1),
  subjectId: z.string().optional(),
  facultyId: z.string().min(1),
  facultyName: z.string().min(1),
  classroomId: z.string().min(1),
  batchId: z.string().optional(),
  batchName: z.string().min(1),
  building: z.string().min(1),
  floor: z.coerce.number().int().min(0),
  roomNumber: z.string().min(1),
  dayOfWeek: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  duration: z.string().min(1),
  status: z.string().optional().default('scheduled'),
  remarks: z.string().optional(),
  recurringClass: z.coerce.boolean().optional().default(false),
  recurrenceType: z.string().optional(),
  recurrenceEndDate: z.string().optional(),
});

export const updateTimetableSchema = createTimetableSchema.partial();

export type CreateTimetableInput = z.infer<typeof createTimetableSchema>;
export type UpdateTimetableInput = z.infer<typeof updateTimetableSchema>;
