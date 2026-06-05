import { z } from "zod";

export const createEmailPreferencesSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
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
