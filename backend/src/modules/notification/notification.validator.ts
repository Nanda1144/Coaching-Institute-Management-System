import { z } from 'zod';

export const createNotificationSchema = z.object({
  title: z.string().min(1).max(200),
  message: z.string().min(1),
  target: z.string().min(1),
  sentBy: z.string().optional(),
});

export const updateNotificationSchema = createNotificationSchema.partial();

export const notificationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  target: z.string().optional(),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>;
export type NotificationQueryInput = z.infer<typeof notificationQuerySchema>;
