import { z } from "zod";

export const liveSessionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional().nullable(),
  meetUrl: z.string().url("Please enter a valid Google Meet or meeting URL"),
  startTime: z.string().or(z.date()).transform((val) => new Date(val)),
  endTime: z.string().or(z.date()).transform((val) => new Date(val)),
  courseId: z.string().optional().nullable(),
}).refine((data) => data.endTime > data.startTime, {
  message: "End time must be after start time",
  path: ["endTime"],
});

export type LiveSessionInput = z.infer<typeof liveSessionSchema>;
