import { z } from "zod";


export const noteCreateSchema = z.object({
  lessonId: z.string().min(1),
  content: z.string().min(1, "Note content is required"),
  timestamp: z.number().optional(), // video timestamp in seconds
});

export const noteUpdateSchema = z.object({
  content: z.string().min(1),
});

export type NoteCreateInput = z.infer<typeof noteCreateSchema>;
export type NoteUpdateInput = z.infer<typeof noteUpdateSchema>;
