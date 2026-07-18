import { z } from 'zod';

export const dashboardQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type DashboardQueryInput = z.infer<typeof dashboardQuerySchema>;
