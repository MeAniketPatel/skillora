import { z } from "zod";

export const createAttachmentsSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
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
