import { z } from "zod";

export const createGiftCardsSchema = z.object({
  // TODO: define input shape
});

export const updateGiftCardsSchema = z.object({
  id: z.string(),
});

export const listGiftCardsQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateGiftCardsInput = z.infer<typeof createGiftCardsSchema>;
export type UpdateGiftCardsInput = z.infer<typeof updateGiftCardsSchema>;
export type ListGiftCardsQuery = z.infer<typeof listGiftCardsQuerySchema>;
