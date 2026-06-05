import { z } from "zod";
import type { UseFormReturn } from "react-hook-form";

export const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  thumbnail: z.string().url().optional().or(z.literal("")),
  promoVideo: z.string().url().nullable().optional().or(z.literal("")),
  price: z.number().min(0, "Price must be positive"),
  categoryId: z.string().min(1, "Category is required"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"]),
});

export type CourseValues = z.infer<typeof courseSchema>;

export type CourseEditorForm = UseFormReturn<CourseValues>;

export interface CourseEditorCourse {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  promoVideo: string | null;
  price: number | null;
  categoryId: string | null;
  level: string;
  status: string;
  sections?: { lessons?: { isPublished: boolean }[] }[];
}

export interface CourseEditorCategory {
  id: string;
  name: string;
}

export interface ChecklistItem {
  label: string;
  completed: boolean;
  missingField?: string;
}

export function buildChecklist(
  values: CourseValues,
  sections: CourseEditorCourse["sections"],
): ChecklistItem[] {
  const hasPublishedLesson =
    sections?.some((s) => s.lessons?.some((l) => l.isPublished)) ?? false;

  const textOnlyDescription = (values.description ?? "").replace(
    /<[^>]*>/g,
    "",
  ).trim();

  return [
    { label: "Course Title", completed: !!values.title?.trim() },
    {
      label: "Description",
      completed: textOnlyDescription.length > 0,
      missingField: "description",
    },
    {
      label: "Category Selected",
      completed: !!values.categoryId,
      missingField: "categoryId",
    },
    {
      label: "Course Thumbnail",
      completed: !!values.thumbnail,
      missingField: "thumbnail",
    },
    { label: "At least one published lesson", completed: hasPublishedLesson },
  ];
}

export const MISSING_FIELD_MESSAGES: Record<string, string> = {
  title: "Course title is required",
  description: "Course description is required",
  categoryId: "Please choose a category",
  thumbnail: "Please upload a course thumbnail",
};
