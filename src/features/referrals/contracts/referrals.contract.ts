import { z } from "zod";

export const createReferralsSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
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
