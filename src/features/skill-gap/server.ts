// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.

// Repository functions
export { getCoursesForSkill, getSkillGapRecommendations, getSkillNodeById, getFeaturedSkillsCatalog, getFeaturedCourses, getPlatformStats, getRecommendation } from "./repositories/skill-gap.repository";
export type { FeaturedCourse } from "./repositories/skill-gap.repository";
