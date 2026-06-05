import { z } from "zod";

export const createCategoriesSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});

export const updateCategoriesSchema = z.object({
  id: z.string(),
});

export const listCategoriesQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateCategoriesInput = z.infer<typeof createCategoriesSchema>;
export type UpdateCategoriesInput = z.infer<typeof updateCategoriesSchema>;
export type ListCategoriesQuery = z.infer<typeof listCategoriesQuerySchema>;
