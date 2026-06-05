import { z } from "zod";

export const createCodePlaygroundSchema = z.object({
  // TODO: define input shape
});

export const updateCodePlaygroundSchema = z.object({
  id: z.string(),
});

export const listCodePlaygroundQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateCodePlaygroundInput = z.infer<typeof createCodePlaygroundSchema>;
export type UpdateCodePlaygroundInput = z.infer<typeof updateCodePlaygroundSchema>;
export type ListCodePlaygroundQuery = z.infer<typeof listCodePlaygroundQuerySchema>;
