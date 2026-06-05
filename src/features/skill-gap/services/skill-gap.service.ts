// Auto-generated service wrapper for the skill-gap feature.
// Delegates to the repositories by default (DI via default-param pattern
// per ADR-007). Mutation methods emit domain events on the in-process
// event bus for cross-feature side effects.
import { eventBus } from "@/shared/events";
import * as skillGapRepo from "../repositories/skill-gap.repository";

export const skillGapService = {
  getCoursesForSkill: skillGapRepo.getCoursesForSkill,
  getSkillGapRecommendations: skillGapRepo.getSkillGapRecommendations,
  getSkillNodeById: skillGapRepo.getSkillNodeById,
  getFeaturedSkillsCatalog: skillGapRepo.getFeaturedSkillsCatalog,
  getFeaturedCourses: skillGapRepo.getFeaturedCourses,
  getPlatformStats: skillGapRepo.getPlatformStats,
  getRecommendation: skillGapRepo.getRecommendation,
};

export type SkillGapService = typeof skillGapService;
