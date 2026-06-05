import { z } from "zod";

export const createNotificationsSchema = z.object({
  // TODO: define input shape
});

export const updateNotificationsSchema = z.object({
  id: z.string(),
});

export const listNotificationsQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateNotificationsInput = z.infer<typeof createNotificationsSchema>;
export type UpdateNotificationsInput = z.infer<typeof updateNotificationsSchema>;
export type ListNotificationsQuery = z.infer<typeof listNotificationsQuerySchema>;
