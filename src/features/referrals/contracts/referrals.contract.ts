import { z } from "zod";

export const createReferralsSchema = z.object({
  // TODO: define input shape
});

export const updateReferralsSchema = z.object({
  id: z.string(),
});

export const listReferralsQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateReferralsInput = z.infer<typeof createReferralsSchema>;
export type UpdateReferralsInput = z.infer<typeof updateReferralsSchema>;
export type ListReferralsQuery = z.infer<typeof listReferralsQuerySchema>;
