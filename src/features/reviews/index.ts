// Auto-generated barrel: re-exports all repositories for the reviews feature.

// Permissions
export { canReviews as canReviews, assertReviewsAccess } from "./permissions/reviews.permissions";

// Contracts
export { createReviewsSchema, updateReviewsSchema, listReviewsQuerySchema } from "./contracts/reviews.contract";
export type { CreateReviewsInput, UpdateReviewsInput, ListReviewsQuery } from "./contracts/reviews.contract";

