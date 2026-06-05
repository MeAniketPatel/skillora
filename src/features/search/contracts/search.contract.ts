import { z } from "zod";

export const createSearchSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});

export const updateSearchSchema = z.object({
  id: z.string(),
});

export const listSearchQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateSearchInput = z.infer<typeof createSearchSchema>;
export type UpdateSearchInput = z.infer<typeof updateSearchSchema>;
export type ListSearchQuery = z.infer<typeof listSearchQuerySchema>;
