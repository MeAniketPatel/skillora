import { z } from "zod";

export const createBundleSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  price: z.coerce.number().min(0),
  courseIds: z.array(z.string()).min(1, "A bundle must contain at least 1 course."),
});
