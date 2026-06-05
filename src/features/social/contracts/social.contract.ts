import { z } from "zod";

export const createSocialSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
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
