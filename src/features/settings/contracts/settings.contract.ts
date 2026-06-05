import { z } from "zod";

export const createSettingsSchema = z.object({
  // TODO: define input shape
});

export const updateSettingsSchema = z.object({
  id: z.string(),
});

export const listSettingsQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateSettingsInput = z.infer<typeof createSettingsSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
export type ListSettingsQuery = z.infer<typeof listSettingsQuerySchema>;
