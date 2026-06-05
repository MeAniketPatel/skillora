import { z } from "zod";

export const createGiftCardsSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
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
