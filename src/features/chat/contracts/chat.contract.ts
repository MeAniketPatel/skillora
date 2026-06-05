import { z } from "zod";

export const createChatSchema = z.object({
  // TODO: define input shape
});

export const updateChatSchema = z.object({
  id: z.string(),
});

export const listChatQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateChatInput = z.infer<typeof createChatSchema>;
export type UpdateChatInput = z.infer<typeof updateChatSchema>;
export type ListChatQuery = z.infer<typeof listChatQuerySchema>;
