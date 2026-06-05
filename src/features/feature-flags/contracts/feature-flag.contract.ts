import { z } from "zod";


export const featureFlagSchema = z.object({
  key: z
    .string()
    .min(2)
    .max(64)
    .regex(/^[a-z_]+$/, "Key must be lowercase with underscores only"),
  name: z.string().min(2).max(100),
  description: z.string().max(300).optional(),
  isEnabled: z.boolean().default(false),
  rolloutPct: z.number().int().min(0).max(100).default(100),
});

export const toggleFeatureFlagSchema = z.object({
  id: z.string().min(1),
  isEnabled: z.boolean(),
});

export const updateRolloutSchema = z.object({
  id: z.string().min(1),
  rolloutPct: z.number().int().min(0).max(100),
});
