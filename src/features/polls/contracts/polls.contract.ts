import { z } from "zod";

export const createPollsSchema = z.object({
  // TODO: define input shape
});

export const updatePollsSchema = z.object({
  id: z.string(),
});

export const listPollsQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreatePollsInput = z.infer<typeof createPollsSchema>;
export type UpdatePollsInput = z.infer<typeof updatePollsSchema>;
export type ListPollsQuery = z.infer<typeof listPollsQuerySchema>;
