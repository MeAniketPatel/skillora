// Auto-generated service wrapper for the learning-paths feature.
// Delegates to the repositories by default (DI via default-param pattern
// per ADR-007). Mutation methods emit domain events on the in-process
// event bus for cross-feature side effects.
import { eventBus } from "@/shared/events";
import * as learningPathRepo from "../repositories/learning-path.repository";

export const learningPathsService = {
  getLearningPaths: learningPathRepo.getLearningPaths,
  getLearningPathDetail: learningPathRepo.getLearningPathDetail,
  isEnrolledInPath: learningPathRepo.isEnrolledInPath,
  async enrollInLearningPath(...args: Parameters<typeof learningPathRepo.enrollInLearningPath>): Promise<Awaited<ReturnType<typeof learningPathRepo.enrollInLearningPath>>> {
    const result = await learningPathRepo.enrollInLearningPath(...args);
    await eventBus.emit({ name: "learning-paths.enrollInLearningPath", feature: "learning-paths", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  getPathEnrollment: learningPathRepo.getPathEnrollment,
  async updatePathProgress(...args: Parameters<typeof learningPathRepo.updatePathProgress>): Promise<Awaited<ReturnType<typeof learningPathRepo.updatePathProgress>>> {
    const result = await learningPathRepo.updatePathProgress(...args);
    await eventBus.emit({ name: "learning-paths.updatePathProgress", feature: "learning-paths", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
};

export type LearningPathsService = typeof learningPathsService;
