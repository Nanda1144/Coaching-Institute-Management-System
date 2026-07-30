import { z } from 'zod';

export const subscribeSchema = z.object({
  planId: z.string().min(1, 'Plan ID is required'),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;
