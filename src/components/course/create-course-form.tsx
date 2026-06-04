"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import LinkButton from "@/components/ui/link-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createCourse } from "@/actions/course.actions";

const createSchema = z.object({
  title: z.string().min(1, "Title is required"),
  categoryId: z.string().min(1, "Category is required"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"]),
});

type CreateValues = z.infer<typeof createSchema>;

interface CreateCourseFormProps {
  categories: { id: string; name: string }[];
}

export default function CreateCourseForm({
  categories,
}: CreateCourseFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateValues>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      title: "",
      categoryId: "",
      level: "BEGINNER",
    },
  });

  const onSubmit = (values: CreateValues) => {
    setError(null);
    startTransition(async () => {
      const res = await createCourse(values);
      if (!res.success) {
        setError(res.error);
      } else {
        router.push(`/teacher/courses/${res.data.id}`);
      }
    });
  };

  return (
    <Card className="w-full max-w-xl mx-auto border border-neutral-200/50 dark:border-neutral-800/50 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Name your course</CardTitle>
        <CardDescription>
          What would you like to name your course? Don&apos;t worry, you can
          change this later.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              aria-invalid={!!errors.title}
              placeholder="e.g. 'Advanced Web Development'"
              {...register("title")}
              disabled={isPending}
              className="bg-white/50 dark:bg-neutral-950/50"
            />
            {errors.title && (
              <p className="text-sm text-red-500 font-medium">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <select
                id="categoryId"
                aria-invalid={!!errors.categoryId}
                {...register("categoryId")}
                disabled={isPending}
                className="w-full h-10 px-3 rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:focus:ring-neutral-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Course Level</Label>
              <select
                id="level"
                aria-invalid={!!errors.level}
                {...register("level")}
                disabled={isPending}
                className="w-full h-10 px-3 rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:focus:ring-neutral-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
                <option value="ALL_LEVELS">All Levels</option>
              </select>
              {errors.level && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.level.message}
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex items-center gap-x-2 pt-4">
            <LinkButton
              variant="ghost"
              href="/teacher/courses"
              className={isPending ? "opacity-50 pointer-events-none" : ""}
            >
              Cancel
            </LinkButton>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Continue"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
