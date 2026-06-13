"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import RichTextEditor from "@/shared/components/shared/rich-text-editor";
import { generateAICourseDescription } from "@/features/ai";
import type {
  CourseEditorCategory,
  CourseEditorForm,
} from "./course-editor.shared";
import type { CourseValues } from "./course-editor.shared";

interface CourseEditorFormProps {
  form: CourseEditorForm;
  categories: CourseEditorCategory[];
  isPending: boolean;
  onSubmit: (values: CourseValues) => void;
}

const LEVEL_OPTIONS = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
  { value: "ALL_LEVELS", label: "All Levels" },
];

export function CourseEditorFormSection({
  form,
  categories,
  isPending,
  onSubmit,
}: CourseEditorFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;
  const descriptionVal = watch("description");
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 relative overflow-hidden">
      <CardHeader>
        <CardTitle>Course Details</CardTitle>
        <CardDescription>Configure basic course properties.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field
            id="title"
            label="Course Title"
            error={errors.title?.message}
          >
            <Input
              id="title"
              aria-invalid={!!errors.title}
              {...register("title")}
              disabled={isPending}
            />
          </Field>

          <div className="space-y-2">
            <Label>Description</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending || isGenerating}
              onClick={async () => {
                const title = watch("title");
                if (!title?.trim()) {
                  form.setError("title", { message: "Title is required first" });
                  return;
                }
                setIsGenerating(true);
                const res = await generateAICourseDescription(title);
                setIsGenerating(false);
                if (res.success) {
                  setValue("description", res.data.description);
                }
              }}
              className="mb-2"
            >
              {isGenerating ? "Generating..." : "✨ Auto-Generate Description (AI)"}
            </Button>
            <div id="description" aria-invalid={!!errors.description}>
              <RichTextEditor
                value={descriptionVal || ""}
                onChange={(val) => setValue("description", val)}
                disabled={isPending}
              />
            </div>
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field
              id="categoryId"
              label="Category"
              error={errors.categoryId?.message}
            >
              <select
                id="categoryId"
                aria-invalid={!!errors.categoryId}
                {...register("categoryId")}
                disabled={isPending}
                className="w-full h-10 px-3 rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 text-sm aria-invalid:border-destructive"
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field id="level" label="Level">
              <select
                id="level"
                {...register("level")}
                disabled={isPending}
                className="w-full h-10 px-3 rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 text-sm"
              >
                {LEVEL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field id="language" label="Course Language">
              <select
                id="language"
                {...register("language")}
                disabled={isPending}
                className="w-full h-10 px-3 rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 text-sm"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="hi">Hindi</option>
                <option value="zh">Chinese</option>
                <option value="ja">Japanese</option>
              </select>
            </Field>

            <Field
              id="price"
              label="Price ($)"
              error={errors.price?.message}
            >
              <Input
                id="price"
                type="number"
                aria-invalid={!!errors.price}
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                disabled={isPending}
              />
            </Field>
          </div>

          <Button type="submit" disabled={isPending} className="mt-4">
            Save Details
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
