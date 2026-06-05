import { z } from "zod";

export const createContactSchema = z.object({
  // TODO: define input shape
});

export const updateContactSchema = z.object({
  id: z.string(),
});

export const listContactQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
export type ListContactQuery = z.infer<typeof listContactQuerySchema>;
