import { z } from "zod";

export const createSkillGapSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
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
