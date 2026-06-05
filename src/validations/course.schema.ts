import { z } from "zod";
import { APP } from "@/shared/constants/app";

export const courseCreateSchema = z.object({
  title: z.string().min(APP.COURSE_TITLE_MIN_LENGTH).max(APP.COURSE_TITLE_MAX_LENGTH),
  categoryId: z.string().min(1, "Category is required"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"]),
});

export const courseUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  shortDescription: z.string().max(300).optional(),
  thumbnail: z.string().url().optional().or(z.literal("")),
  promoVideo: z.string().url().optional().or(z.literal("")).or(z.null()),
  price: z.number().min(0).optional(),
  categoryId: z.string().optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"]).optional(),
  language: z.string().optional(),
  learningOutcomes: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  targetAudience: z.array(z.string()).optional(),
});

export const sectionCreateSchema = z.object({
  title: z.string().min(1, "Section title is required"),
});

export const lessonUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().optional(),
  isFree: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  videoUrl: z.string().url().optional().or(z.literal("")).or(z.null()),
  videoDuration: z.number().optional().or(z.null()),
  type: z.enum(["VIDEO", "ARTICLE", "QUIZ", "ASSIGNMENT"]).optional(),
});

export type CourseCreateInput = z.infer<typeof courseCreateSchema>;
export type CourseUpdateInput = z.infer<typeof courseUpdateSchema>;
export type SectionCreateInput = z.infer<typeof sectionCreateSchema>;
export type LessonUpdateInput = z.infer<typeof lessonUpdateSchema>;
