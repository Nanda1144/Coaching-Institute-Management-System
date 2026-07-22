import { z } from 'zod';

export const createReminderSchema = z.object({
  assignmentId: z.string().uuid(),
  studentId: z.string().uuid().optional(),
  reminderDate: z.coerce.date(),
  reminderTime: z.coerce.date(),
  reminderType: z.enum(['upcoming_deadline', 'overdue', 'recurring', 'custom']),
  notificationChannel: z.enum(['email', 'sms', 'push', 'all']),
  frequency: z.enum(['once', 'daily', 'weekly', 'custom']).optional().default('once'),
});

export const updateReminderSchema = createReminderSchema.partial();

export const reminderQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  status: z.enum(['pending', 'sent', 'failed', 'cancelled']).optional(),
  assignmentId: z.string().optional(),
});

export type CreateReminderInput = z.infer<typeof createReminderSchema>;
export type UpdateReminderInput = z.infer<typeof updateReminderSchema>;
export type ReminderQueryInput = z.infer<typeof reminderQuerySchema>;
