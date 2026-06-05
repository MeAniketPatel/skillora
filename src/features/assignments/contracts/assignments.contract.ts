import { z } from "zod";

export const createAssignmentsSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});

export const updateAssignmentsSchema = z.object({
  id: z.string(),
});

export const listAssignmentsQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateAssignmentsInput = z.infer<typeof createAssignmentsSchema>;
export type UpdateAssignmentsInput = z.infer<typeof updateAssignmentsSchema>;
export type ListAssignmentsQuery = z.infer<typeof listAssignmentsQuerySchema>;
