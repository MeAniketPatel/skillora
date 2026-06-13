import type { Role } from "@/core/entities";
import { ForbiddenError } from "@/shared/lib/errors";

export type AccessRule = Role[] | "PUBLIC";

export const canReviews: Record<string, AccessRule> = {
  view: ["STUDENT","TEACHER","ADMIN"],
  create: ["STUDENT","TEACHER","ADMIN"],
  update: ["TEACHER","ADMIN"],
  delete: ["ADMIN"],
};

export function assertReviewsAccess(role: Role | null | undefined, action: keyof typeof canReviews = "view") {
  const rule = canReviews[action];
  if (rule === "PUBLIC") return;
  if (!role || !rule.includes(role)) {
    throw new ForbiddenError(`Access denied: role '${role ?? "anonymous"}' cannot ${action} reviews`);
  }
}
