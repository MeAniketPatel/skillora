// Auto-generated barrel: re-exports all repositories for the reviews feature.

// Permissions
export { canReviews as canReviews, assertReviewsAccess } from "./permissions/reviews.permissions";




// Contracts
export { reviewCreateSchema, reviewUpdateSchema } from "./contracts/review.contract";
export type { ReviewCreateInput, ReviewUpdateInput } from "./contracts/review.contract";
export { createReviewsSchema, updateReviewsSchema, listReviewsQuerySchema } from "./contracts/reviews.contract";
export type { CreateReviewsInput, UpdateReviewsInput } from "./contracts/reviews.contract";



// Hooks
export { useReviews } from "./hooks/use-reviews";

