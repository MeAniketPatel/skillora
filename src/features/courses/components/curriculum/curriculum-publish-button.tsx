"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Send, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  publishCourse,
  unpublishCourse,
} from "@/features/courses/actions/course.actions";
import { toast } from "sonner";
import { CourseStatus } from "@prisma/client";

interface CurriculumPublishButtonProps {
  courseId: string;
  initialStatus: CourseStatus;
}

export function CurriculumPublishButton({
  courseId,
  initialStatus,
}: CurriculumPublishButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<CourseStatus>(initialStatus);

  const isPublished = status === "PUBLISHED";

  const handleToggle = () => {
    startTransition(async () => {
      const res = isPublished
        ? await unpublishCourse(courseId)
        : await publishCourse(courseId);

      if (!res.success) {
        toast.error(res.error || "Failed to update course status");
        return;
      }

      setStatus(isPublished ? "DRAFT" : "PUBLISHED");
      toast.success(
        isPublished ? "Course unpublished" : "Course published successfully!",
      );
      router.refresh();
    });
  };

  return (
    <Button
      onClick={handleToggle}
      disabled={isPending}
      variant={isPublished ? "outline" : "default"}
      className="gap-2"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isPublished ? (
        <XCircle className="h-4 w-4" />
      ) : (
        <Send className="h-4 w-4" />
      )}
      {isPublished ? "Unpublish" : "Publish course"}
      {isPublished && (
        <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          <CheckCircle2 className="h-3 w-3" />
          Live
        </span>
      )}
    </Button>
  );
}
