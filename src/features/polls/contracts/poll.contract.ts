import { z } from "zod";


export const pollSchema = z.object({
  question: z.string().min(3, "Question must be at least 3 characters long"),
  options: z
    .array(z.string().min(1, "Option text cannot be empty"))
    .min(2, "At least 2 options are required")
    .max(6, "Maximum of 6 options is allowed"),
});
