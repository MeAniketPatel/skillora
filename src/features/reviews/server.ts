export { createReview, updateReview, deleteReview, getCourseReviews, getUserReviewForCourse, getCourseRatingStats, getTeacherReviews, getTeacherAverageRating } from "./repositories/review.repository";

import { reviewsService as service } from "./services/reviews.service";
export { service };

