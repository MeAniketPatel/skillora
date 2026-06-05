import { z } from "zod";

export const createAnnouncementsSchema = z.object({
  // TODO: define input shape
});

export const updateAnnouncementsSchema = z.object({
  id: z.string(),
});

export const listAnnouncementsQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateAnnouncementsInput = z.infer<typeof createAnnouncementsSchema>;
export type UpdateAnnouncementsInput = z.infer<typeof updateAnnouncementsSchema>;
export type ListAnnouncementsQuery = z.infer<typeof listAnnouncementsQuerySchema>;
