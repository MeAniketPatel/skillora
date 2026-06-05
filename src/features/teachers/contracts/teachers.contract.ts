import { z } from "zod";

export const createTeachersSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});

export const updateTeachersSchema = z.object({
  id: z.string(),
});

export const listTeachersQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateTeachersInput = z.infer<typeof createTeachersSchema>;
export type UpdateTeachersInput = z.infer<typeof updateTeachersSchema>;
export type ListTeachersQuery = z.infer<typeof listTeachersQuerySchema>;
