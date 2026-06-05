import { z } from "zod";

export const createBundlesSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
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
