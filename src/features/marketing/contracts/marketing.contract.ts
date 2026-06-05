import { z } from "zod";

export const createMarketingSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});

export const updateMarketingSchema = z.object({
  id: z.string(),
});

export const listMarketingQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateMarketingInput = z.infer<typeof createMarketingSchema>;
export type UpdateMarketingInput = z.infer<typeof updateMarketingSchema>;
export type ListMarketingQuery = z.infer<typeof listMarketingQuerySchema>;
