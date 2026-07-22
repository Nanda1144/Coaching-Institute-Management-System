import { z } from 'zod';

export const createHolidaySchema = z.object({
  holidayName: z.string().min(1).max(200),
  holidayType: z.string().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  description: z.string().optional(),
  applicableDepartments: z.array(z.string()).min(1),
  academicYear: z.string().optional(),
});

export const updateHolidaySchema = createHolidaySchema.partial();

export const holidayQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  holidayType: z.string().optional(),
  academicYear: z.string().optional(),
});

export type CreateHolidayInput = z.infer<typeof createHolidaySchema>;
export type UpdateHolidayInput = z.infer<typeof updateHolidaySchema>;
export type HolidayQueryInput = z.infer<typeof holidayQuerySchema>;
