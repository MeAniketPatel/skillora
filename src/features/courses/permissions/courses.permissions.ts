import type { Role } from "@/core/entities";
import { ForbiddenError } from "@/shared/lib/errors";

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
    throw new ForbiddenError(`Access denied: role '${role ?? "anonymous"}' cannot ${action} courses`);
  }
}
