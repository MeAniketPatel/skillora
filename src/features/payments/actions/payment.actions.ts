"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { ValidationError, ConflictError } from "@/shared/lib/errors";
import { service as coursesService } from "@/features/courses/server";
import { service as enrollmentService } from "@/features/enrollment/server";
import { service as studentsService } from "@/features/students/server";
import { service as paymentsService } from "@/features/payments/server";
import { checkoutSchema } from "../contracts/payments.contract";

export async function createCheckoutSession(courseId: string) {
  return actionHandler(async () => {
    const user = await requireAuth();
    checkoutSchema.parse({ courseId });

    const course = await coursesService.getCourseWithCurriculum(courseId);
    if (!course || course.price === null || course.price <= 0) {
      throw new ValidationError("Invalid course or course is free");
    }

    const existingEnrollment = await enrollmentService.getEnrollment(user.id, courseId);
    if (existingEnrollment) {
      throw new ConflictError("Already enrolled in this course");
    }

    const enrollment = await enrollmentService.createEnrollment(user.id, courseId);
    const lessons = course.sections.flatMap((s) => s.lessons);
    if (lessons.length > 0) {
      await studentsService.initializeEnrollmentProgress(
        enrollment.id,
        lessons.map((l) => l.id)
      );
    }

    await paymentsService.createPurchase({
      amount: course.price,
      status: "COMPLETED",
      userId: user.id,
      enrollmentId: enrollment.id,
      mockPaymentId: `pi_mock_${Math.random().toString(36).substring(7)}`,
    });

    revalidatePath("/student/courses");
    revalidatePath("/learn");

    return { url: `/learn/${courseId}/${lessons[0]?.id || ""}` };
  });
}
