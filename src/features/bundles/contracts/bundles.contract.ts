import { z } from "zod";

export const createBundlesSchema = z.object({
  // TODO: define input shape
});

export const updateBundlesSchema = z.object({
  id: z.string(),
});

export const listBundlesQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateBundlesInput = z.infer<typeof createBundlesSchema>;
export type UpdateBundlesInput = z.infer<typeof updateBundlesSchema>;
export type ListBundlesQuery = z.infer<typeof listBundlesQuerySchema>;
