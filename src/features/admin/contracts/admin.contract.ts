import { z } from "zod";

export const createAdminSchema = z.object({
  // TODO: define input shape
});

export const updateAdminSchema = z.object({
  id: z.string(),
});

export const listAdminQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type UpdateAdminInput = z.infer<typeof updateAdminSchema>;
export type ListAdminQuery = z.infer<typeof listAdminQuerySchema>;
