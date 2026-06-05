"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { announcementSchema } from "@/validations/announcement.schema";
import { createAnnouncement } from "@/actions/announcement.actions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Loader2 } from "lucide-react";
import { z } from "zod";

type FormValues = z.infer<typeof announcementSchema>;

interface AnnouncementFormProps {
  courseId: string;
}

export function AnnouncementForm({ courseId }: AnnouncementFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    setError(null);
    startTransition(async () => {
      const res = await createAnnouncement(courseId, data);
      if (!res.success) {
        setError(res.error || "Failed to create announcement.");
      } else {
        reset();
        router.refresh();
      }
    });
  };

  return (
    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs font-bold">Announcement Title</Label>
            <Input
              id="title"
              placeholder="e.g., Exam Date Changed or New Module Released!"
              {...register("title")}
              disabled={isPending}
              className="h-10 rounded-xl"
            />
            {errors.title && (
              <p className="text-[10px] text-red-500 font-medium">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-xs font-bold">Content</Label>
            <Textarea
              id="content"
              placeholder="Write your announcement details here..."
              rows={4}
              {...register("content")}
              disabled={isPending}
              className="rounded-xl resize-none text-xs"
            />
            {errors.content && (
              <p className="text-[10px] text-red-500 font-medium">{errors.content.message}</p>
            )}
          </div>

          {error && (
            <p className="text-[11px] font-semibold text-red-500 bg-red-50 dark:bg-red-950/30 p-2.5 rounded-lg">
              {error}
            </p>
          )}

          <Button type="submit" disabled={isPending} className="w-full h-10 rounded-xl text-xs gap-2">
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Publish Announcement
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
