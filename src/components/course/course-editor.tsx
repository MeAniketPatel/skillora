"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, GraduationCap, ArrowLeft, LayoutGrid } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RichTextEditor from "@/components/shared/rich-text-editor";
import { UploadDropzone } from "@/lib/uploadthing";
import { updateCourse, publishCourse, unpublishCourse } from "@/actions/course.actions";

const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  thumbnail: z.string().url().optional().or(z.literal("")),
  promoVideo: z.string().url().nullable().optional().or(z.literal("")),
  price: z.number().min(0, "Price must be positive"),
  categoryId: z.string().min(1, "Category is required"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"]),
});

type CourseValues = z.infer<typeof courseSchema>;

interface CourseEditorProps {
  course: {
    id: string;
    title: string;
    description: string | null;
    thumbnail: string | null;
    promoVideo: string | null;
    price: number | null;
    categoryId: string | null;
    level: string;
    status: string;
  };
  categories: { id: string; name: string }[];
}

export default function CourseEditor({ course, categories }: CourseEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CourseValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: course.title,
      description: course.description || "",
      thumbnail: course.thumbnail || "",
      promoVideo: course.promoVideo || "",
      price: course.price || 0,
      categoryId: course.categoryId || "",
      level: course.level as any,
    },
  });

  const thumbnailVal = watch("thumbnail");
  const promoVideoVal = watch("promoVideo");
  const descriptionVal = watch("description");

  const onSubmit = (values: CourseValues) => {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const res = await updateCourse(course.id, values);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess("Course updated successfully!");
        router.refresh();
      }
    });
  };

  const togglePublish = () => {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      if (course.status === "PUBLISHED") {
        const res = await unpublishCourse(course.id);
        if (res.error) setError(res.error);
        else setSuccess("Course unpublished!");
      } else {
        const res = await publishCourse(course.id);
        if (res.error) setError(res.error);
        else setSuccess("Course published successfully!");
      }
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-x-2">
          <Button variant="ghost" size="icon" render={<Link href="/teacher/courses" />}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Course Setup</h1>
            <p className="text-sm text-neutral-500">Edit course details, thumbnail, pricing, and curriculum.</p>
          </div>
        </div>

        <div className="flex items-center gap-x-2">
          <Button variant="outline" render={<Link href={`/teacher/courses/${course.id}/curriculum`} />}>
            <LayoutGrid className="mr-2 h-4 w-4" />
            Curriculum
          </Button>
          <Button variant={course.status === "PUBLISHED" ? "outline" : "default"} onClick={togglePublish} disabled={isPending}>
            {course.status === "PUBLISHED" ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column - Metadata */}
        <div className="space-y-6">
          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
              <CardDescription>Configure basic course properties.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input id="title" {...register("title")} disabled={isPending} />
                  {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <RichTextEditor
                    value={descriptionVal || ""}
                    onChange={(val) => setValue("description", val)}
                    disabled={isPending}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryId">Category</Label>
                    <select
                      id="categoryId"
                      {...register("categoryId")}
                      disabled={isPending}
                      className="w-full h-10 px-3 rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 text-sm"
                    >
                      <option value="">Select a category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <select
                      id="level"
                      {...register("level")}
                      disabled={isPending}
                      className="w-full h-10 px-3 rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 text-sm"
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                      <option value="ALL_LEVELS">All Levels</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" type="number" step="0.01" {...register("price", { valueAsNumber: true })} disabled={isPending} />
                  {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
                </div>

                <Button type="submit" disabled={isPending} className="mt-4">
                  Save Details
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Thumbnail and Media */}
        <div className="space-y-6">
          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
            <CardHeader>
              <CardTitle>Course Thumbnail</CardTitle>
              <CardDescription>Upload a course cover image.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {thumbnailVal ? (
                <div className="aspect-video w-full relative rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumbnailVal} alt="Thumbnail" className="w-full h-full object-cover" />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setValue("thumbnail", "")}
                    disabled={isPending}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] bg-neutral-50/50 dark:bg-neutral-950/20">
                  <UploadDropzone
                    endpoint="courseThumbnail"
                    onClientUploadComplete={(res) => {
                      if (res?.[0]?.url) {
                        setValue("thumbnail", res[0].url);
                        setSuccess("Thumbnail uploaded successfully!");
                      }
                    }}
                    onUploadError={(error: Error) => {
                      setError(`Upload failed: ${error.message}`);
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
            <CardHeader>
              <CardTitle>Course Promo Video</CardTitle>
              <CardDescription>Upload a short video to introduce your course.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {promoVideoVal ? (
                <div className="space-y-4">
                  <div className="aspect-video w-full relative rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-black">
                    <video src={promoVideoVal} controls className="w-full h-full object-contain" />
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setValue("promoVideo", "");
                      onSubmit(watch());
                    }}
                    disabled={isPending}
                  >
                    Remove Video
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] bg-neutral-50/50 dark:bg-neutral-950/20">
                  <UploadDropzone
                    endpoint="courseVideo"
                    onClientUploadComplete={(res) => {
                      if (res?.[0]?.url) {
                        setValue("promoVideo", res[0].url);
                        setSuccess("Promo video uploaded successfully!");
                        onSubmit({ ...watch(), promoVideo: res[0].url });
                      }
                    }}
                    onUploadError={(error: Error) => {
                      setError(`Upload failed: ${error.message}`);
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
