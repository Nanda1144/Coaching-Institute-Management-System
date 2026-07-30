import { z } from 'zod';

export const createAuditSchema = z.object({
  action: z.string().min(1, 'Action is required'),
  entity: z.string().min(1, 'Entity is required'),
  entityId: z.string().optional(),
  userId: z.string().optional(),
  details: z.any().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

export const auditQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  action: z.string().optional(),
  entity: z.string().optional(),
  userId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional(),
});
