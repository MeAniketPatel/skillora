import { z } from "zod";

export const createStudyGroupsSchema = z.object({
  // TODO: define input shape
});

export const updateStudyGroupsSchema = z.object({
  id: z.string(),
});

export const listStudyGroupsQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateStudyGroupsInput = z.infer<typeof createStudyGroupsSchema>;
export type UpdateStudyGroupsInput = z.infer<typeof updateStudyGroupsSchema>;
export type ListStudyGroupsQuery = z.infer<typeof listStudyGroupsQuerySchema>;
