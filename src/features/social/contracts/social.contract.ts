import { z } from "zod";

export const createSocialSchema = z.object({
  // TODO: define input shape
});

export const updateSocialSchema = z.object({
  id: z.string(),
});

export const listSocialQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateSocialInput = z.infer<typeof createSocialSchema>;
export type UpdateSocialInput = z.infer<typeof updateSocialSchema>;
export type ListSocialQuery = z.infer<typeof listSocialQuerySchema>;
