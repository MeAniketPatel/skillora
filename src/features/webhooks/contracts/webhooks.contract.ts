import { z } from "zod";

export const createWebhooksSchema = z.object({
  // TODO: define input shape
});

export const updateWebhooksSchema = z.object({
  id: z.string(),
});

export const listWebhooksQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateWebhooksInput = z.infer<typeof createWebhooksSchema>;
export type UpdateWebhooksInput = z.infer<typeof updateWebhooksSchema>;
export type ListWebhooksQuery = z.infer<typeof listWebhooksQuerySchema>;
