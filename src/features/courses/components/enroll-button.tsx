"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { enrollInFreeCourse } from "@/features/enrollment/actions/enrollment.actions";
import { createCheckoutSession } from "@/features/payments/actions/payment.actions";

interface EnrollButtonProps {
  courseId: string;
  isLoggedIn: boolean;
  isEnrolled: boolean;
  firstLessonId: string | null;
  price: number | null;
}

export default function EnrollButton({ courseId, isLoggedIn, isEnrolled, firstLessonId, price }: EnrollButtonProps) {
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

  const handleEnrollOrBuy = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setError(null);
    startTransition(async () => {
      if (price !== null && price > 0) {
        const res = await createCheckoutSession(courseId);
        if (!res.success) {
          setError(res.error);
        } else if (res.data.url) {
          window.location.href = res.data.url;
        }
      } else {
        const res = await enrollInFreeCourse(courseId);
        if (!res.success) {
          setError(res.error);
        } else if (firstLessonId) {
          router.refresh();
          router.push(`/learn/${courseId}/${firstLessonId}`);
        }
      }
    });
  };

  const buttonText = price !== null && price > 0 
    ? `Buy Now ($${price})` 
    : "Enroll Now (Free)";

  return (
    <div className="w-full space-y-2">
      <Button 
        onClick={handleEnrollOrBuy} 
        disabled={isPending} 
        className="w-full font-semibold"
      >
        {isPending ? "Processing..." : buttonText}
      </Button>
      {error && (
        <p className="text-xs text-red-500 text-center font-medium">{error}</p>
      )}
    </div>
  );
}

