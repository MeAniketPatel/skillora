import { z } from "zod";

export const createDiscussionsSchema = z.object({
  // TODO: define input shape
});

export const updateDiscussionsSchema = z.object({
  id: z.string(),
});

export const listDiscussionsQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateDiscussionsInput = z.infer<typeof createDiscussionsSchema>;
export type UpdateDiscussionsInput = z.infer<typeof updateDiscussionsSchema>;
export type ListDiscussionsQuery = z.infer<typeof listDiscussionsQuerySchema>;
