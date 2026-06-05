import { z } from "zod";

export const createStudentsSchema = z.object({
  // TODO: define input shape
});

export const updateStudentsSchema = z.object({
  id: z.string(),
});

export const listStudentsQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateStudentsInput = z.infer<typeof createStudentsSchema>;
export type UpdateStudentsInput = z.infer<typeof updateStudentsSchema>;
export type ListStudentsQuery = z.infer<typeof listStudentsQuerySchema>;
