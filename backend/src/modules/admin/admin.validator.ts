import { z } from 'zod';

export const updatePermissionsSchema = z.object({
  permissions: z.array(z.string()),
});
