import { z } from "zod";

export const createSubscriptionsSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
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
