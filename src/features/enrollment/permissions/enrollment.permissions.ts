import type { Role } from "@/core/entities";
import { ForbiddenError } from "@/shared/lib/errors";

export type AccessRule = Role[] | "PUBLIC";

export const canEnrollment: Record<string, AccessRule> = {
  view: ["STUDENT","TEACHER","ADMIN"],
  create: ["STUDENT","TEACHER","ADMIN"],
  update: ["TEACHER","ADMIN"],
  delete: ["ADMIN"],
};

export function assertEnrollmentAccess(role: Role | null | undefined, action: keyof typeof canEnrollment = "view") {
  const rule = canEnrollment[action];
  if (rule === "PUBLIC") return;
  if (!role || !rule.includes(role)) {
    throw new ForbiddenError(`Access denied: role '${role ?? "anonymous"}' cannot ${action} enrollment`);
  }
}
