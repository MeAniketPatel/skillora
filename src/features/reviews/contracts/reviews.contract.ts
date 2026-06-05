import { z } from "zod";

export const createReviewsSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});

export const updateReviewsSchema = z.object({
  id: z.string(),
});

export const listReviewsQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateReviewsInput = z.infer<typeof createReviewsSchema>;
export type UpdateReviewsInput = z.infer<typeof updateReviewsSchema>;
export type ListReviewsQuery = z.infer<typeof listReviewsQuerySchema>;
