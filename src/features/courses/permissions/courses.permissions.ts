// Auto-generated permission map for the courses feature.
// Override individual entries by exporting a const with the same name.
import type { Role } from "@/core/entities";

export type AccessRule = Role[] | "PUBLIC";

export const canCourses: Record<string, AccessRule> = {
  view: "PUBLIC",
  create: ["TEACHER","ADMIN"],
  update: ["TEACHER","ADMIN"],
  delete: ["ADMIN"],
};

export function assertCoursesAccess(role: Role | null | undefined, action: keyof typeof canCourses = "view") {
  const rule = canCourses[action];
  if (rule === "PUBLIC") return;
  if (!role || !rule.includes(role)) {
    throw new Error(`Access denied: role '${role ?? "anonymous"}' cannot ${action} courses`);
  }
}
