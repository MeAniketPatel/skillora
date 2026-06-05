import { z } from "zod";

export const createGamificationSchema = z.object({
  // TODO: define input shape
});

export const updateGamificationSchema = z.object({
  id: z.string(),
});

export const listGamificationQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateGamificationInput = z.infer<typeof createGamificationSchema>;
export type UpdateGamificationInput = z.infer<typeof updateGamificationSchema>;
export type ListGamificationQuery = z.infer<typeof listGamificationQuerySchema>;
