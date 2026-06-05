import { z } from "zod";

export const emailPreferenceSchema = z.object({
  digestType: z.enum(["DAILY", "WEEKLY", "NEVER"]),
  enrollment: z.boolean(),
  certificates: z.boolean(),
  promotions: z.boolean(),
  forumReplies: z.boolean(),
});

export type EmailPreferenceInput = z.infer<typeof emailPreferenceSchema>;
