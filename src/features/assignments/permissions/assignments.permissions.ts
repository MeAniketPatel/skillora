import type { Role } from "@/core/entities";
import { ForbiddenError } from "@/shared/lib/errors";

export type AccessRule = Role[] | "PUBLIC";

export const canAssignments: Record<string, AccessRule> = {
  view: ["TEACHER","STUDENT","ADMIN"],
  create: ["TEACHER","STUDENT","ADMIN"],
  update: ["TEACHER","ADMIN"],
  delete: ["ADMIN"],
};

export function assertAssignmentsAccess(role: Role | null | undefined, action: keyof typeof canAssignments = "view") {
  const rule = canAssignments[action];
  if (rule === "PUBLIC") return;
  if (!role || !rule.includes(role)) {
    throw new ForbiddenError(`Access denied: role '${role ?? "anonymous"}' cannot ${action} assignments`);
  }
}
