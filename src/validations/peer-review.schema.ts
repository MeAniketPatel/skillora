import { z } from "zod";

export const peerReviewConfigSchema = z.object({
  requiredReviews: z.coerce
    .number()
    .min(1, "At least 1 review is required")
    .max(10, "Maximum of 10 reviews is allowed"),
  dueDate: z.coerce
    .date()
    .refine((date) => date > new Date(), {
      message: "Due date must be in the future",
    }),
});
