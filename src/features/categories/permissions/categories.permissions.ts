import type { Role } from "@/core/entities";
import { ForbiddenError } from "@/shared/lib/errors";

export type AccessRule = Role[] | "PUBLIC";

export const canCategories: Record<string, AccessRule> = {
  view: "PUBLIC",
  create: ["ADMIN"],
  update: ["ADMIN"],
  delete: ["ADMIN"],
};

export function assertCategoriesAccess(role: Role | null | undefined, action: keyof typeof canCategories = "view") {
  const rule = canCategories[action];
  if (rule === "PUBLIC") return;
  if (!role || !rule.includes(role)) {
    throw new ForbiddenError(`Access denied: role '${role ?? "anonymous"}' cannot ${action} categories`);
  }
}
