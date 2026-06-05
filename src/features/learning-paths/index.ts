// Auto-generated barrel: re-exports all repositories for the learning-paths feature.
export * from "./repositories/learning-path.repository";

// Components
export { PathTimeline } from "./components/path-timeline";

// Services
export { learningPathsService } from "./services/learning-paths.service";
export type { LearningPathsService } from "./services/learning-paths.service";

// Permissions
export { canLearningPaths as canLearningPaths, assertLearningPathsAccess } from "./permissions/learning-paths.permissions";
