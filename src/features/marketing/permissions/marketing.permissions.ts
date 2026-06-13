import type { Role } from "@/core/entities";
import { ForbiddenError } from "@/shared/lib/errors";

export type AccessRule = Role[] | "PUBLIC";

export const canMarketing: Record<string, AccessRule> = {
  view: "PUBLIC",
  create: [],
  update: [],
  delete: [],
};

export function assertMarketingAccess(role: Role | null | undefined, action: keyof typeof canMarketing = "view") {
  const rule = canMarketing[action];
  if (rule === "PUBLIC") return;
  if (!role || !rule.includes(role)) {
    throw new ForbiddenError(`Access denied: role '${role ?? "anonymous"}' cannot ${action} marketing`);
  }
}
