// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.

// Repository functions
export { getLearningPaths, getLearningPathDetail, isEnrolledInPath, enrollInLearningPath, getPathEnrollment, updatePathProgress } from "./repositories/learning-path.repository";

// Service

// Service
import { learningPathsService as service } from "./services/learning-paths.service";
export { service };

export * from './index';
