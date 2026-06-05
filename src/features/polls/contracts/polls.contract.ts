import { z } from "zod";

export const createPollsSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
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
