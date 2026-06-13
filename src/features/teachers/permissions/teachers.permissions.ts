import type { Role } from "@/core/entities";
import { ForbiddenError } from "@/shared/lib/errors";

export type AccessRule = Role[] | "PUBLIC";

export const canTeachers: Record<string, AccessRule> = {
  view: ["TEACHER","ADMIN"],
  create: ["TEACHER","ADMIN"],
  update: ["TEACHER","ADMIN"],
  delete: ["ADMIN"],
};

export function assertTeachersAccess(role: Role | null | undefined, action: keyof typeof canTeachers = "view") {
  const rule = canTeachers[action];
  if (rule === "PUBLIC") return;
  if (!role || !rule.includes(role)) {
    throw new ForbiddenError(`Access denied: role '${role ?? "anonymous"}' cannot ${action} teachers`);
  }
}

export function isTeacherOrAdmin(role: Role | null | undefined): boolean {
  return role === "TEACHER" || role === "ADMIN";
}
