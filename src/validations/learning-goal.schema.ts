import { z } from "zod";

export const createGoalSchema = z.object({
  type: z.enum(["WEEKLY", "MONTHLY"]),
  target: z.number().int().positive("Target must be a positive number"),
  targetDate: z.any(),
});

export const updateGoalProgressSchema = z.object({
  progress: z.number().int().nonnegative(),
});
