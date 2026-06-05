import { z } from "zod";


export const privacySettingsSchema = z.object({
  profileVisible: z.boolean(),
  activityVisible: z.boolean(),
  messagingPreference: z.enum(["ALL", "FRIENDS", "NONE"]),
});

export type PrivacySettingsInput = z.infer<typeof privacySettingsSchema>;
