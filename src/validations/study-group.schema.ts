import { z } from "zod";

export const createStudyGroupSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().max(200).optional(),
  isPrivate: z.boolean().default(false),
});

export const studyGroupMessageSchema = z.object({
  content: z.string().min(1).max(1000),
});
