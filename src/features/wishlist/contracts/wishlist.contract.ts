import { z } from "zod";

export const createWishlistSchema = z.object({
  // TODO: define input shape
});

export const updateWishlistSchema = z.object({
  id: z.string(),
});

export const listWishlistQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateWishlistInput = z.infer<typeof createWishlistSchema>;
export type UpdateWishlistInput = z.infer<typeof updateWishlistSchema>;
export type ListWishlistQuery = z.infer<typeof listWishlistQuerySchema>;
