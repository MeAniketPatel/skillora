"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { reviewCreateSchema, reviewUpdateSchema } from "@/validations/review.schema";
import { createReview as createReviewData, updateReview as updateReviewData, deleteReview as deleteReviewData, getUserReviewForCourse } from "@/data";
import { ConflictError, NotFoundError } from "@/shared/lib/errors";

export async function createReview(values: any) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const validated = reviewCreateSchema.parse(values);

    const existing = await getUserReviewForCourse(user.id, validated.courseId);
    if (existing) {
      throw new ConflictError("You have already reviewed this course.");
    }

    const review = await createReviewData(user.id, validated.courseId, validated.rating, validated.comment);
    revalidatePath(`/courses`);
    return review;
  });
}

export async function updateReview(reviewId: string, values: any) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const validated = reviewUpdateSchema.parse(values);

    const review = await updateReviewData(reviewId, user.id, validated);
    revalidatePath(`/courses`);
    return review;
  });
}

export async function deleteReview(reviewId: string) {
  return actionHandler(async () => {
    const user = await requireAuth();
    await deleteReviewData(reviewId, user.id);
    revalidatePath(`/courses`);
    return true;
  });
}
