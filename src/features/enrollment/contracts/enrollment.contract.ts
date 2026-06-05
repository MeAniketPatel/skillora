import { z } from "zod";

export const createEnrollmentSchema = z.object({
  // TODO: define input shape
});

export const updateEnrollmentSchema = z.object({
  id: z.string(),
});

export const listEnrollmentQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateEnrollmentInput = z.infer<typeof createEnrollmentSchema>;
export type UpdateEnrollmentInput = z.infer<typeof updateEnrollmentSchema>;
export type ListEnrollmentQuery = z.infer<typeof listEnrollmentQuerySchema>;
