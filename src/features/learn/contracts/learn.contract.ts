import { z } from "zod";

export const createLearnSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
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
