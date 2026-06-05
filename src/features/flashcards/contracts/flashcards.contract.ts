import { z } from "zod";

export const createFlashcardsSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});

export const updateFlashcardsSchema = z.object({
  id: z.string(),
});

export const listFlashcardsQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateFlashcardsInput = z.infer<typeof createFlashcardsSchema>;
export type UpdateFlashcardsInput = z.infer<typeof updateFlashcardsSchema>;
export type ListFlashcardsQuery = z.infer<typeof listFlashcardsQuerySchema>;
