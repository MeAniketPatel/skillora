import { z } from "zod";

export const createCoursesSchema = z.object({
  // TODO: define input shape
});

export const updateCoursesSchema = z.object({
  id: z.string(),
});

export const listCoursesQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateCoursesInput = z.infer<typeof createCoursesSchema>;
export type UpdateCoursesInput = z.infer<typeof updateCoursesSchema>;
export type ListCoursesQuery = z.infer<typeof listCoursesQuerySchema>;
