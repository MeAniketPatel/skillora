// Auto-generated barrel: re-exports all repositories for the learning-paths feature.
export * from "./repositories/learning-path.repository";

// Components
export { PathTimeline } from "./components/path-timeline";

// Services
export { learningPathsService } from "./services/learning-paths.service";
export type { LearningPathsService } from "./services/learning-paths.service";

// Permissions
export { canLearningPaths as canLearningPaths, assertLearningPathsAccess } from "./permissions/learning-paths.permissions";

// Contracts
export { createLearningPathsSchema, updateLearningPathsSchema, listLearningPathsQuerySchema } from "./contracts/learning-paths.contract";
export type { CreateLearningPathsInput, UpdateLearningPathsInput, ListLearningPathsQuery } from "./contracts/learning-paths.contract";

// Hooks
export {  useLearningPathsList, useLearningPathsDetail, useLearningPathsCreate, useLearningPathsUpdate, useLearningPathsDelete } from "./hooks/use-learning-paths";

