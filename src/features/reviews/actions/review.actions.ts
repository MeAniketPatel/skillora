"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { reviewCreateSchema, reviewUpdateSchema } from "@/features/reviews/contracts/review.contract";
import { service as reviewsService } from "@/features/reviews/server";
import { ConflictError } from "@/shared/lib/errors";

import { assertReviewsAccess } from "@/features/reviews/permissions/reviews.permissions";
export async function createReview(values: any) {
  return actionHandler(async () => {
    const user = await requireAuth();
    assertReviewsAccess(user.role, "update");
    const validated = reviewCreateSchema.parse(values);

    const existing = await reviewsService.getUserReviewForCourse(user.id, validated.courseId);
    if (existing) {
      throw new ConflictError("You have already reviewed this course.");
    }

    const review = await reviewsService.createReview(user.id, validated.courseId, validated.rating, validated.comment);
    revalidatePath(`/courses`);
    return review;
  });
}

export async function updateReview(reviewId: string, values: any) {
  return actionHandler(async () => {
    const user = await requireAuth();
    assertReviewsAccess(user.role, "update");
    const validated = reviewUpdateSchema.parse(values);

    const review = await reviewsService.updateReview(reviewId, user.id, validated);
    revalidatePath(`/courses`);
    return review;
  });
}

export async function deleteReview(reviewId: string) {
  return actionHandler(async () => {
    const user = await requireAuth();
    await reviewsService.deleteReview(reviewId, user.id);
    revalidatePath(`/courses`);
    return true;
  });
}
