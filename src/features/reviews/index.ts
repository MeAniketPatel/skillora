// Auto-generated barrel: re-exports all repositories for the reviews feature.
export * from "./repositories/review.repository";

// Services
export { reviewsService } from "./services/reviews.service";
export type { ReviewsService } from "./services/reviews.service";

// Permissions
export { canReviews as canReviews, assertReviewsAccess } from "./permissions/reviews.permissions";
