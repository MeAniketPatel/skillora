import { z } from "zod";

export const createLearnSchema = z.object({
  // TODO: define input shape
});

export const updateLearnSchema = z.object({
  id: z.string(),
});

export const listLearnQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateLearnInput = z.infer<typeof createLearnSchema>;
export type UpdateLearnInput = z.infer<typeof updateLearnSchema>;
export type ListLearnQuery = z.infer<typeof listLearnQuerySchema>;
