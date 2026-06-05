import { z } from "zod";

export const createEmailPreferencesSchema = z.object({
  // TODO: define input shape
});

export const updateEmailPreferencesSchema = z.object({
  id: z.string(),
});

export const listEmailPreferencesQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateEmailPreferencesInput = z.infer<typeof createEmailPreferencesSchema>;
export type UpdateEmailPreferencesInput = z.infer<typeof updateEmailPreferencesSchema>;
export type ListEmailPreferencesQuery = z.infer<typeof listEmailPreferencesQuerySchema>;
