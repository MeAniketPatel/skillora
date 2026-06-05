import { z } from "zod";

export const createFeatureFlagsSchema = z.object({
  // TODO: define input shape
});

export const updateFeatureFlagsSchema = z.object({
  id: z.string(),
});

export const listFeatureFlagsQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateFeatureFlagsInput = z.infer<typeof createFeatureFlagsSchema>;
export type UpdateFeatureFlagsInput = z.infer<typeof updateFeatureFlagsSchema>;
export type ListFeatureFlagsQuery = z.infer<typeof listFeatureFlagsQuerySchema>;
