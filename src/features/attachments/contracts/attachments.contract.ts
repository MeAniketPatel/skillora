import { z } from "zod";

export const createAttachmentsSchema = z.object({
  // TODO: define input shape
});

export const updateAttachmentsSchema = z.object({
  id: z.string(),
});

export const listAttachmentsQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateAttachmentsInput = z.infer<typeof createAttachmentsSchema>;
export type UpdateAttachmentsInput = z.infer<typeof updateAttachmentsSchema>;
export type ListAttachmentsQuery = z.infer<typeof listAttachmentsQuerySchema>;
