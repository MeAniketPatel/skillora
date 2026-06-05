import { z } from "zod";

export const createSkillGapSchema = z.object({
  // TODO: define input shape
});

export const updateSkillGapSchema = z.object({
  id: z.string(),
});

export const listSkillGapQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateSkillGapInput = z.infer<typeof createSkillGapSchema>;
export type UpdateSkillGapInput = z.infer<typeof updateSkillGapSchema>;
export type ListSkillGapQuery = z.infer<typeof listSkillGapQuerySchema>;
