import { z } from "zod";

export const createFeatureFlagsSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
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
