import type { Role } from "@/core/entities";
import { ForbiddenError } from "@/shared/lib/errors";

export type AccessRule = Role[] | "PUBLIC";

export const canLearn: Record<string, AccessRule> = {
  view: ["STUDENT","TEACHER","ADMIN"],
  create: ["STUDENT","TEACHER","ADMIN"],
  update: ["TEACHER","ADMIN"],
  delete: ["ADMIN"],
};

export function assertLearnAccess(role: Role | null | undefined, action: keyof typeof canLearn = "view") {
  const rule = canLearn[action];
  if (rule === "PUBLIC") return;
  if (!role || !rule.includes(role)) {
    throw new ForbiddenError(`Access denied: role '${role ?? "anonymous"}' cannot ${action} learn`);
  }
}
