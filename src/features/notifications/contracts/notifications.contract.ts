import { z } from "zod";

export const createNotificationsSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
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
