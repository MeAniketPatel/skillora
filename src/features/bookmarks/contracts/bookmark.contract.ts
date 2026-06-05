import { z } from "zod";


export const toggleBookmarkSchema = z.object({
  lessonId: z.string().min(1),
});
