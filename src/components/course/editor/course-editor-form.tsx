"use client";

import { Sparkles } from "lucide-react";
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
import type {
  CourseEditorCategory,
  CourseEditorForm,
} from "./course-editor.shared";
import type { CourseValues } from "./course-editor.shared";

interface CourseEditorFormProps {
  form: CourseEditorForm;
  categories: CourseEditorCategory[];
  isPending: boolean;
  isGeneratingAI: boolean;
  onGenerateAI: () => void;
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
  isGeneratingAI,
  onGenerateAI,
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

  return (
    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
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
            <div className="flex items-center justify-between">
              <Label>Description</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onGenerateAI}
                disabled={isPending || isGeneratingAI}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 h-7 font-bold px-2 hover:bg-indigo-50/20"
              >
                <Sparkles className="h-3 w-3" />
                {isGeneratingAI ? "Generating..." : "Generate AI Description"}
              </Button>
            </div>
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
          </div>

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
