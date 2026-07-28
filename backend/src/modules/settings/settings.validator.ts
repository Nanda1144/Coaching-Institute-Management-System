import { z } from 'zod';

export const updateSettingsSchema = z.object({
  section: z.string().optional(),
}).passthrough();

export const sectionParamSchema = z.object({
  section: z.enum(['institute', 'academic', 'security', 'notifications', 'appearance', 'backup']),
});
