import type { Role } from "@/core/entities";
import { ForbiddenError } from "@/shared/lib/errors";

export type AccessRule = Role[] | "PUBLIC";

export const canAuth: Record<string, AccessRule> = {
  view: "PUBLIC",
  create: ["STUDENT","TEACHER","ADMIN"],
  update: ["TEACHER","ADMIN"],
  delete: ["ADMIN"],
};

export function assertAuthAccess(role: Role | null | undefined, action: keyof typeof canAuth = "view") {
  const rule = canAuth[action];
  if (rule === "PUBLIC") return;
  if (!role || !rule.includes(role)) {
    throw new ForbiddenError(`Access denied: role '${role ?? "anonymous"}' cannot ${action} auth`);
  }
}

export function isTeacherOrAdmin(role: Role | null | undefined): boolean {
  return role === "TEACHER" || role === "ADMIN";
}
