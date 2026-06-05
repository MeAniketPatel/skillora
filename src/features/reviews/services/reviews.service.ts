// Auto-generated service wrapper for the reviews feature.
// Delegates to the repositories by default (DI via default-param pattern
// per ADR-007). Mutation methods emit domain events on the in-process
// event bus for cross-feature side effects.
import { eventBus } from "@/shared/events";
import * as reviewRepo from "../repositories/review.repository";

export const reviewsService = {
  async createReview(...args: Parameters<typeof reviewRepo.createReview>): Promise<Awaited<ReturnType<typeof reviewRepo.createReview>>> {
    const result = await reviewRepo.createReview(...args);
    await eventBus.emit({ name: "reviews.createReview", feature: "reviews", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async updateReview(...args: Parameters<typeof reviewRepo.updateReview>): Promise<Awaited<ReturnType<typeof reviewRepo.updateReview>>> {
    const result = await reviewRepo.updateReview(...args);
    await eventBus.emit({ name: "reviews.updateReview", feature: "reviews", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async deleteReview(...args: Parameters<typeof reviewRepo.deleteReview>): Promise<Awaited<ReturnType<typeof reviewRepo.deleteReview>>> {
    const result = await reviewRepo.deleteReview(...args);
    await eventBus.emit({ name: "reviews.deleteReview", feature: "reviews", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  getCourseReviews: reviewRepo.getCourseReviews,
  getUserReviewForCourse: reviewRepo.getUserReviewForCourse,
  getCourseRatingStats: reviewRepo.getCourseRatingStats,
  getTeacherReviews: reviewRepo.getTeacherReviews,
  getTeacherAverageRating: reviewRepo.getTeacherAverageRating,
};

export type ReviewsService = typeof reviewsService;
