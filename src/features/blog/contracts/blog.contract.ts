import { z } from "zod";

export const createBlogSchema = z.object({
  // TODO: define input shape
});

export const updateBlogSchema = z.object({
  id: z.string(),
});

export const listBlogQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type ListBlogQuery = z.infer<typeof listBlogQuerySchema>;
