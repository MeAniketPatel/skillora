import { z } from "zod";

export const settingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});

export type SettingInput = z.infer<typeof settingSchema>;
