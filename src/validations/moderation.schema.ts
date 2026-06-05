import { z } from "zod";

export const moderationReviewSchema = z.object({
  id: z.string().min(1),
});

export const flagContentSchema = z.object({
  contentType: z.enum(["REVIEW", "DISCUSSION", "BLOG_POST", "COMMENT"]),
  contentId: z.string().min(1),
  reason: z.string().max(500).optional(),
});
