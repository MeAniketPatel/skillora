import { z } from "zod";

export const recordStudySessionSchema = z.object({
  durationSeconds: z.number().min(1),
});

export const purchaseStreakFreezeSchema = z.object({
  costPoints: z.number().min(0).default(100),
});
