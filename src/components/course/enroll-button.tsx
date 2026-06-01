"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { enrollInFreeCourse } from "@/actions/enrollment.actions";

interface EnrollButtonProps {
  courseId: string;
  isLoggedIn: boolean;
  isEnrolled: boolean;
  firstLessonId: string | null;
}

export default function EnrollButton({ courseId, isLoggedIn, isEnrolled, firstLessonId }: EnrollButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (isEnrolled && firstLessonId) {
    return (
      <Button 
        onClick={() => router.push(`/learn/${courseId}/${firstLessonId}`)}
        className="w-full font-semibold"
      >
        Go to Course
      </Button>
    );
  }

  const handleEnroll = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setError(null);
    startTransition(async () => {
      const res = await enrollInFreeCourse(courseId);
      if (res.error) {
        setError(res.error);
      } else if (firstLessonId) {
        router.refresh();
        router.push(`/learn/${courseId}/${firstLessonId}`);
      }
    });
  };

  return (
    <div className="w-full space-y-2">
      <Button 
        onClick={handleEnroll} 
        disabled={isPending} 
        className="w-full font-semibold"
      >
        {isPending ? "Enrolling..." : "Enroll Now (Free)"}
      </Button>
      {error && (
        <p className="text-xs text-red-500 text-center font-medium">{error}</p>
      )}
    </div>
  );
}
