import { z } from "zod";


export const createDiscussionSchema = z.object({
  title: z.string().min(5).max(100),
  content: z.string().min(10).max(5000),
  category: z.enum(["GENERAL", "HELP", "SHOW_AND_TELL"]),
});

export const discussionReplySchema = z.object({
  content: z.string().min(2).max(2000),
});
