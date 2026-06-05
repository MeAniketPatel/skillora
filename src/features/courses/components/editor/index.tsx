"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  buildChecklist,
  courseSchema,
  type CourseEditorCategory,
  type CourseEditorCourse,
  type CourseValues,
} from "./course-editor.shared";
import { CourseEditorHeader } from "./course-editor-header";
import { CourseEditorFormSection } from "./course-editor-form";
import { CourseEditorMediaSection } from "./course-editor-media";
import { CourseEditorChecklist } from "./course-editor-checklist";
import { CourseInsights } from "@/features/teachers";
import { generateAICourseDescription } from "@/features/ai";
import {
  publishCourse,
  unpublishCourse,
  updateCourse,
} from "../../actions/course.actions";

interface CourseEditorProps {
  course: CourseEditorCourse;
  categories: CourseEditorCategory[];
}

export default function CourseEditor({ course, categories }: CourseEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<CourseValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: course.title,
      description: course.description || "",
      thumbnail: course.thumbnail || "",
      promoVideo: course.promoVideo || "",
      price: course.price || 0,
      categoryId: course.categoryId || "",
      level: course.level as CourseValues["level"],
    },
  });

  const watchedValues = form.watch();
  const checklist = buildChecklist(watchedValues, course.sections);
  const completedFields = checklist.filter((i) => i.completed).length;
  const totalFields = checklist.length;
  const isComplete = checklist.every((i) => i.completed);

  const handleAIDescription = async () => {
    const titleVal = form.getValues("title");
    if (!titleVal || !titleVal.trim()) {
      setError("Please fill in the course title first.");
      return;
    }
    setIsGeneratingAI(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await generateAICourseDescription(titleVal);
      if (!res.success) {
        setError(res.error);
      } else if (res.data.description) {
        form.setValue("description", res.data.description);
        setSuccess("AI Description generated successfully! Save your changes below.");
      }
    } catch {
      setError("AI generation failed.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const onSubmit = (values: CourseValues) => {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const res = await updateCourse(course.id, values);
      if (!res.success) {
        setError(res.error);
      } else {
        setSuccess("Course updated successfully!");
        router.refresh();
      }
    });
  };

  const handleMediaUploadComplete = (override: Record<string, unknown>) => {
    const values = { ...form.getValues(), ...override };
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const res = await updateCourse(course.id, values);
      if (!res.success) {
        setError(res.error);
      } else {
        setSuccess("Media updated successfully!");
        router.refresh();
      }
    });
  };

  const handleMediaError = (message: string) => {
    setError(message);
  };

  const focusAndScroll = (field: string) => {
    try {
      const el = document.getElementById(field);
      if (el) {
        if ("focus" in el) (el as HTMLElement).focus();
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } catch {
      // ignore
    }
  };

  const togglePublish = () => {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      if (course.status === "PUBLISHED") {
        const res = await unpublishCourse(course.id);
        if (!res.success) setError(res.error);
        else setSuccess("Course unpublished!");
        router.refresh();
        return;
      }

      const values = form.getValues();
      const missing: string[] = [];
      if (!values.title?.trim()) missing.push("title");
      const textOnlyDesc = (values.description ?? "").replace(/<[^>]*>/g, "").trim();
      if (!textOnlyDesc) missing.push("description");
      if (!values.thumbnail) missing.push("thumbnail");
      if (!values.categoryId) missing.push("categoryId");

      if (missing.length) {
        missing.forEach((f) =>
          form.setError(f as keyof CourseValues, {
            type: "manual",
            message: "This field is required",
          }),
        );
        focusAndScroll(missing[0]);
        setError("Please fill in all required fields.");
        return;
      }

      const hasPublishedLesson = checklist.find(
        (i) => i.label === "At least one published lesson",
      )?.completed;
      if (!hasPublishedLesson) {
        setError(
          "You must publish at least one lesson in the curriculum before publishing the course.",
        );
        return;
      }

      const res = await publishCourse(course.id);
      if (!res.success) {
        const missingFields = (res as unknown as { missingFields?: string[] }).missingFields;
        if (missingFields?.length) {
          missingFields.forEach((f) =>
            form.setError(f as keyof CourseValues, {
              type: "server",
              message: "This field is required",
            }),
          );
          focusAndScroll(missingFields[0]);
        }
        setError(res.error);
      } else {
        setSuccess("Course published successfully!");
      }
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <CourseEditorHeader
        courseId={course.id}
        courseStatus={course.status}
        completedFields={completedFields}
        totalFields={totalFields}
        isPending={isPending}
        isPublishable={isComplete}
        onTogglePublish={togglePublish}
      />

      {success && (
        <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-950/30 dark:text-green-400 rounded-lg">
          {success}
        </div>
      )}
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      <CourseInsights courseId={course.id} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <CourseEditorFormSection
            form={form}
            categories={categories}
            isPending={isPending}
            isGeneratingAI={isGeneratingAI}
            onGenerateAI={handleAIDescription}
            onSubmit={onSubmit}
          />
        </div>
        <div className="space-y-6">
          <CourseEditorChecklist courseId={course.id} items={checklist} />
          <CourseEditorMediaSection
            form={form}
            isPending={isPending}
            onUploadComplete={handleMediaUploadComplete}
            onError={handleMediaError}
          />
        </div>
      </div>
    </div>
  );
}
