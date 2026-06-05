import { z } from "zod";

export const createCodePlaygroundSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
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
