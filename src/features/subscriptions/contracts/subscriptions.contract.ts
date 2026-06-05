import { z } from "zod";

export const createSubscriptionsSchema = z.object({
  // TODO: define input shape
});

export const updateSubscriptionsSchema = z.object({
  id: z.string(),
});

export const listSubscriptionsQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateSubscriptionsInput = z.infer<typeof createSubscriptionsSchema>;
export type UpdateSubscriptionsInput = z.infer<typeof updateSubscriptionsSchema>;
export type ListSubscriptionsQuery = z.infer<typeof listSubscriptionsQuerySchema>;
