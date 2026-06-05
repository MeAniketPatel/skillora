// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.

// Repository functions
export { createReview, updateReview, deleteReview, getCourseReviews, getUserReviewForCourse, getCourseRatingStats, getTeacherReviews, getTeacherAverageRating } from "./repositories/review.repository";

// Service

// Service
import { reviewsService as service } from "./services/reviews.service";
export { service };
