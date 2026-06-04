"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  GraduationCap,
  ArrowLeft,
  LayoutGrid,
  Sparkles,
  CheckCircle,
  Check,
  X,
} from "lucide-react";

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
import RichTextEditor from "@/components/shared/rich-text-editor";
import { UploadDropzone } from "@/lib/uploadthing";
import {
  updateCourse,
  publishCourse,
  unpublishCourse,
} from "@/actions/course.actions";
import { generateAICourseDescription } from "@/actions/ai.actions";

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
    sections?: any[];
  };
  categories: { id: string; name: string }[];
}

export default function CourseEditor({
  course,
  categories,
}: CourseEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isDraggingThumbnail, setIsDraggingThumbnail] = useState(false);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);

  const handleAIDescription = async () => {
    const titleVal = watch("title");
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
        setValue("description", res.data.description);
        setSuccess(
          "AI Description generated successfully! Save your changes below.",
        );
      }
    } catch (err) {
      setError("AI generation failed.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError: setFormError,
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
  const titleVal = watch("title");
  const categoryIdVal = watch("categoryId");

  const sections = course.sections || [];
  const hasPublishedLesson = sections.some((s: any) =>
    s.lessons?.some((l: any) => l.isPublished)
  );

  const checklistItems = [
    { label: "Course Title", completed: !!titleVal?.trim() },
    { label: "Description", completed: !!descriptionVal && descriptionVal.replace(/<[^>]*>/g, '').trim().length > 0 },
    { label: "Category Selected", completed: !!categoryIdVal },
    { label: "Course Thumbnail", completed: !!thumbnailVal },
    { label: "At least one published lesson", completed: hasPublishedLesson },
  ];

  const totalFields = checklistItems.length;
  const completedFields = checklistItems.filter(item => item.completed).length;
  const isComplete = checklistItems.every(item => item.completed);

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

  const togglePublish = () => {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      if (course.status === "PUBLISHED") {
        const res = await unpublishCourse(course.id);
        if (!res.success) setError(res.error);
        else setSuccess("Course unpublished!");
      } else {
        // Clear any previous form errors
        // Client-side quick checks (title/description/thumbnail/category)
        const missing: string[] = [];
        if (!titleVal || !titleVal.trim()) missing.push("title");
        const textOnlyDesc = descriptionVal ? descriptionVal.replace(/<[^>]*>/g, '').trim() : "";
        if (!textOnlyDesc) missing.push("description");
        if (!thumbnailVal) missing.push("thumbnail");
        if (!categoryIdVal) missing.push("categoryId");

        // If we found missing locally, mark form fields before server call
        if (missing.length) {
          missing.forEach((f) =>
            setFormError(f as any, {
              type: "manual",
              message: "This field is required",
            }),
          );

          // Focus and scroll to first missing field
          const first = missing[0];
          try {
            const el = document.getElementById(first);
            if (el) {
              el.focus();
              el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          } catch (e) {
            // ignore
          }

          setError("Please fill in all required fields.");
          return;
        }

        if (!hasPublishedLesson) {
          setError("You must publish at least one lesson in the curriculum before publishing the course.");
          return;
        }

        const res = await publishCourse(course.id);
        if (!res.success) {
          // If server returned missingFields, set those on the form as well
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((res as any).missingFields) {
            (res as any).missingFields.forEach((f: string) =>
              setFormError(f as any, {
                type: "server",
                message: "This field is required",
              }),
            );

            // Focus the first missing field if present
            const first = (res as any).missingFields[0];
            try {
              const el = document.getElementById(first);
              if (el) {
                el.focus();
                el.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            } catch (e) {
              // ignore
            }
          }
          setError(res.error);
        } else {
          setSuccess("Course published successfully!");
        }
      }
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-x-2">
          <LinkButton variant="ghost" size="icon" href="/teacher/courses">
            <ArrowLeft className="h-4 w-4" />
          </LinkButton>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              Course Setup
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                {completedFields}/{totalFields} fields completed
              </span>
            </h1>
            <p className="text-sm text-neutral-500">
              Edit course details, thumbnail, pricing, and curriculum.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-x-2">
          <LinkButton
            variant="outline"
            href={`/teacher/courses/${course.id}/curriculum`}
          >
            <LayoutGrid className="mr-2 h-4 w-4" />
            Curriculum
          </LinkButton>
          <Button
            variant={course.status === "PUBLISHED" ? "outline" : "default"}
            onClick={togglePublish}
            disabled={isPending || (course.status !== "PUBLISHED" && !isComplete)}
          >
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
              <CardDescription>
                Configure basic course properties.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    aria-invalid={!!errors.title}
                    {...register("title")}
                    disabled={isPending}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Description</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleAIDescription}
                      disabled={isPending || isGeneratingAI}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 h-7 font-bold px-2 hover:bg-indigo-50/20"
                    >
                      <Sparkles className="h-3 w-3" />{" "}
                      {isGeneratingAI
                        ? "Generating..."
                        : "Generate AI Description"}
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
                  <div className="space-y-2">
                    <Label htmlFor="categoryId">Category</Label>
                    <select
                      id="categoryId"
                      aria-invalid={!!errors.categoryId}
                      {...register("categoryId")}
                      disabled={isPending}
                      className="w-full h-10 px-3 rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 text-sm aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
                    >
                      <option value="">Select a category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <p className="text-sm text-red-500">{errors.categoryId.message}</p>
                    )}
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
                  <Input
                    id="price"
                    type="number"
                    aria-invalid={!!errors.price}
                    step="0.01"
                    {...register("price", { valueAsNumber: true })}
                    disabled={isPending}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500">
                      {errors.price.message}
                    </p>
                  )}
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
              <CardTitle className="flex items-center gap-2 text-neutral-800 dark:text-neutral-100">
                <CheckCircle className="h-5 w-5 text-indigo-500" />
                Publishing Checklist
              </CardTitle>
              <CardDescription>
                Complete all required fields to publish your course. ({completedFields}/{totalFields} completed)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Progress</span>
                  <span className="font-semibold">{Math.round((completedFields / totalFields) * 100)}%</span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(completedFields / totalFields) * 100}%` }}
                  />
                </div>
              </div>

              <ul className="space-y-2.5 pt-2">
                {checklistItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-neutral-600 dark:text-neutral-300">
                    {item.completed ? (
                      <span className="p-0.5 rounded-full bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 mt-0.5">
                        <Check className="h-3.5 w-3.5 stroke-[3px]" />
                      </span>
                    ) : (
                      <span className="p-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 mt-0.5">
                        <X className="h-3.5 w-3.5 stroke-[3px]" />
                      </span>
                    )}
                    <div className="flex flex-col">
                      <span className={item.completed ? "line-through text-neutral-400 dark:text-neutral-600 font-medium" : "font-medium text-neutral-700 dark:text-neutral-200"}>
                        {item.label}
                      </span>
                      {!item.completed && item.label === "At least one published lesson" && (
                        <Link 
                          href={`/teacher/courses/${course.id}/curriculum`}
                          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline mt-0.5 font-semibold"
                        >
                          Go to Curriculum Builder &rarr;
                        </Link>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
            <CardHeader>
              <CardTitle>Course Thumbnail</CardTitle>
              <CardDescription>Upload a course cover image.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {thumbnailVal ? (
                <div className="aspect-video w-full relative rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbnailVal}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                  />
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
                <div 
                  id="thumbnail"
                  aria-invalid={!!errors.thumbnail}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingThumbnail(true);
                  }}
                  onDragLeave={() => setIsDraggingThumbnail(false)}
                  onDrop={() => setIsDraggingThumbnail(false)}
                  className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] transition-all duration-200 overflow-hidden ${
                    isDraggingThumbnail 
                      ? "border-indigo-500 bg-indigo-50/10 dark:bg-indigo-950/10 scale-[1.02]" 
                      : "border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-950/20"
                  } aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20`}
                >
                  {isDraggingThumbnail && (
                    <div className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-950/20 z-20 flex flex-col items-center justify-center pointer-events-none border-2 border-indigo-500 rounded-lg animate-pulse">
                      <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                        Drop to upload cover image!
                      </span>
                    </div>
                  )}
                  {isUploadingThumbnail && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-neutral-950/80 z-10 flex flex-col items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
                      <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Uploading cover image...</span>
                    </div>
                  )}
                  <UploadDropzone
                    endpoint="courseThumbnail"
                    config={{ mode: "auto" }}
                    onUploadBegin={() => setIsUploadingThumbnail(true)}
                    onClientUploadComplete={(res) => {
                      setIsUploadingThumbnail(false);
                      if (res?.[0]?.url) {
                        setValue("thumbnail", res[0].url);
                        setSuccess("Thumbnail uploaded successfully!");
                        onSubmit({ ...watch(), thumbnail: res[0].url });
                      }
                    }}
                    onUploadError={(error: Error) => {
                      setIsUploadingThumbnail(false);
                      setError(`Upload failed: ${error.message}`);
                    }}
                  />
                </div>
              )}
              {errors.thumbnail && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.thumbnail.message}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
            <CardHeader>
              <CardTitle>Course Promo Video</CardTitle>
              <CardDescription>
                Upload a short video to introduce your course.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {promoVideoVal ? (
                <div className="space-y-4">
                  <div className="aspect-video w-full relative rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-black">
                    <video
                      src={promoVideoVal}
                      controls
                      className="w-full h-full object-contain"
                    />
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
                <div 
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingVideo(true);
                  }}
                  onDragLeave={() => setIsDraggingVideo(false)}
                  onDrop={() => setIsDraggingVideo(false)}
                  className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] transition-all duration-200 overflow-hidden ${
                    isDraggingVideo 
                      ? "border-indigo-500 bg-indigo-50/10 dark:bg-indigo-950/10 scale-[1.02]" 
                      : "border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-950/20"
                  }`}
                >
                  {isDraggingVideo && (
                    <div className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-950/20 z-20 flex flex-col items-center justify-center pointer-events-none border-2 border-indigo-500 rounded-lg animate-pulse">
                      <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                        Drop to upload promo video!
                      </span>
                    </div>
                  )}
                  {isUploadingVideo && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-neutral-950/80 z-10 flex flex-col items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
                      <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Uploading promo video...</span>
                    </div>
                  )}
                  <UploadDropzone
                    endpoint="courseVideo"
                    config={{ mode: "auto" }}
                    onUploadBegin={() => setIsUploadingVideo(true)}
                    onClientUploadComplete={(res) => {
                      setIsUploadingVideo(false);
                      if (res?.[0]?.url) {
                        setValue("promoVideo", res[0].url);
                        setSuccess("Promo video uploaded successfully!");
                        onSubmit({ ...watch(), promoVideo: res[0].url });
                      }
                    }}
                    onUploadError={(error: Error) => {
                      setIsUploadingVideo(false);
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
