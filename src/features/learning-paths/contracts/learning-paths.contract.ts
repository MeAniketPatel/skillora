import { z } from "zod";

export const createLearningPathsSchema = z.object({
  // TODO: define input shape
});

export const updateLearningPathsSchema = z.object({
  id: z.string(),
});

export const listLearningPathsQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateLearningPathsInput = z.infer<typeof createLearningPathsSchema>;
export type UpdateLearningPathsInput = z.infer<typeof updateLearningPathsSchema>;
export type ListLearningPathsQuery = z.infer<typeof listLearningPathsQuerySchema>;
