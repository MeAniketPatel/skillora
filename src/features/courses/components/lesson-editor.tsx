"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Trash2,
  Video,
  FileText,
  File,
  Download,
  Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button, buttonVariants } from "@/shared/components/ui/button";
import LinkButton from "@/shared/components/ui/link-button";
import { cn } from "@/shared/lib/utils";
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
import { UploadDropzone } from "@/shared/lib/uploadthing";
import {
  updateLesson,
  createAttachment,
  deleteAttachment,
} from "@/actions/course.actions";
import { QuizBuilder } from "@/features/courses";
const lessonSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["VIDEO", "ARTICLE", "QUIZ"]),
  content: z.string().optional(),
  videoUrl: z.string().url().nullable().optional().or(z.literal("")),
  videoDuration: z.number().nullable().optional(),
});

type LessonFormValues = z.infer<typeof lessonSchema>;

interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number | null;
  type: string | null;
}

interface LessonEditorProps {
  courseId: string;
  lesson: {
    id: string;
    sectionId: string;
    title: string;
    type: "VIDEO" | "ARTICLE" | "QUIZ" | "ASSIGNMENT";
    content: string | null;
    videoUrl: string | null;
    videoDuration: number | null;
    attachments: Attachment[];
    quiz?: any;
  };
}

export default function LessonEditor({ courseId, lesson }: LessonEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>(
    lesson.attachments,
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: lesson.title,
      type:
        lesson.type === "VIDEO"
          ? "VIDEO"
          : lesson.type === "QUIZ"
            ? "QUIZ"
            : "ARTICLE",
      content: lesson.content || "",
      videoUrl: lesson.videoUrl || "",
      videoDuration: lesson.videoDuration || null,
    },
  });

  const watchType = watch("type");
  const watchVideoUrl = watch("videoUrl");
  const watchContent = watch("content");

  const onSubmit = (values: LessonFormValues) => {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const res = await updateLesson(courseId, lesson.sectionId, lesson.id, {
        title: values.title,
        type: values.type,
        content: values.type === "ARTICLE" ? values.content : "",
        videoUrl: values.type === "VIDEO" ? values.videoUrl : null,
        videoDuration: values.type === "VIDEO" ? values.videoDuration : null,
      });

      if (!res.success) {
        setError(res.error);
      } else {
        setSuccess("Lesson updated successfully!");
        router.refresh();
      }
    });
  };

  const handleUpdate = () => {
    onSubmit(watch());
  };

  const handleAddAttachment = (file: {
    name: string;
    url: string;
    size: number;
  }) => {
    setError(null);
    startTransition(async () => {
      const res = await createAttachment(
        courseId,
        lesson.id,
        file.name,
        file.url,
        file.size,
        file.name.split(".").pop() || "unknown",
      );

      if (!res.success) {
        setError(res.error);
      } else {
        setAttachments([res.data, ...attachments]);
        setSuccess("Attachment added successfully!");
        router.refresh();
      }
    });
  };

  const handleDeleteAttachment = (attachmentId: string) => {
    setError(null);
    startTransition(async () => {
      const res = await deleteAttachment(courseId, lesson.id, attachmentId);
      if (!res.success) {
        setError(res.error);
      } else {
        setAttachments(attachments.filter((a) => a.id !== attachmentId));
        setSuccess("Attachment removed successfully!");
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-x-2">
        <LinkButton
          variant="ghost"
          size="icon"
          href={`/teacher/courses/${courseId}/curriculum`}
        >
          <ArrowLeft className="h-4 w-4" />
        </LinkButton>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lesson Setup</h1>
          <p className="text-sm text-neutral-500">
            Configure content, media, and attachments for this lesson.
          </p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Lesson Content Card */}
          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
            <CardHeader>
              <CardTitle>Lesson Details</CardTitle>
              <CardDescription>
                Edit lesson type and main body content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Lesson Title</Label>
                  <Input
                    id="title"
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
                  <Label htmlFor="type">Lesson Type</Label>
                  <select
                    id="type"
                    {...register("type")}
                    onChange={(e) => {
                      setValue("type", e.target.value as any);
                      handleUpdate();
                    }}
                    disabled={isPending}
                    className="w-full h-10 px-3 rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 text-sm"
                  >
                    <option value="ARTICLE">Article (Rich Text)</option>
                    <option value="VIDEO">Video</option>
                    <option value="QUIZ">Quiz</option>
                  </select>
                </div>

                {watchType === "ARTICLE" && (
                  <div className="space-y-2">
                    <Label>Article Content</Label>
                    <RichTextEditor
                      value={watchContent || ""}
                      onChange={(val) => setValue("content", val)}
                      disabled={isPending}
                    />
                  </div>
                )}

                {watchType === "VIDEO" && (
                  <div className="space-y-4">
                    <Label>Lesson Video</Label>
                    {watchVideoUrl ? (
                      <div className="space-y-4">
                        <div className="relative aspect-video rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800">
                          <video
                            src={watchVideoUrl}
                            controls
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <Button
                          variant="destructive"
                          type="button"
                          onClick={() => {
                            setValue("videoUrl", null);
                            setValue("videoDuration", null);
                          }}
                          disabled={isPending}
                        >
                          Remove Video
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] bg-neutral-50/50 dark:bg-neutral-950/20">
                        <UploadDropzone
                          endpoint="lessonVideo"
                          onClientUploadComplete={(res) => {
                            const fileUrl = res?.[0]?.ufsUrl || res?.[0]?.url;
                            if (fileUrl) {
                              setValue("videoUrl", fileUrl);
                              setValue("videoDuration", 0);
                              setSuccess(
                                "Video uploaded successfully! Make sure to save details.",
                              );
                            }
                          }}
                          onUploadError={(error: Error) => {
                            setError(`Upload failed: ${error.message}`);
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {watchType === "QUIZ" && (
                  <QuizBuilder lessonId={lesson.id} initialQuiz={lesson.quiz} />
                )}

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full lg:w-auto"
                >
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Details
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Attachments & Materials */}
        <div className="space-y-6">
          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
            <CardHeader>
              <CardTitle>Lesson Resources</CardTitle>
              <CardDescription>
                Upload files (PDF, code files, zip) for students to download.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-4 flex flex-col items-center justify-center bg-neutral-50/50 dark:bg-neutral-950/20">
                <UploadDropzone
                  endpoint="lessonAttachment"
                  onClientUploadComplete={(res) => {
                    if (res) {
                      res.forEach((file) => {
                        handleAddAttachment({
                          name: file.name,
                          url: file.url,
                          size: file.size,
                        });
                      });
                    }
                  }}
                  onUploadError={(error: Error) => {
                    setError(`Upload failed: ${error.message}`);
                  }}
                />
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Uploaded Files
                </h4>
                {attachments.length === 0 ? (
                  <p className="text-xs text-neutral-500 italic">
                    No attachments uploaded yet.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {attachments.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-2 rounded bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <File className="h-4 w-4 text-primary shrink-0" />
                          <span className="truncate font-medium flex-1 text-neutral-700 dark:text-neutral-300">
                            {file.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          <a
                            href={file.url}
                            download
                            target="_blank"
                            rel="noreferrer"
                            className={cn(
                              buttonVariants({
                                variant: "ghost",
                                size: "icon",
                              }),
                              "h-6 w-6",
                            )}
                          >
                            <Download className="h-3 w-3" />
                          </a>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteAttachment(file.id)}
                            disabled={isPending}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
