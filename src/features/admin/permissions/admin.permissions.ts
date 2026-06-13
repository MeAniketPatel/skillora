import type { Role } from "@/core/entities";
import { ForbiddenError } from "@/shared/lib/errors";

export type AccessRule = Role[] | "PUBLIC";

export const canAdmin: Record<string, AccessRule> = {
  view: ["ADMIN"],
  create: ["ADMIN"],
  update: ["ADMIN"],
  delete: ["ADMIN"],
};

export function assertAdminAccess(role: Role | null | undefined, action: keyof typeof canAdmin = "view") {
  const rule = canAdmin[action];
  if (rule === "PUBLIC") return;
  if (!role || !rule.includes(role)) {
    throw new ForbiddenError(`Access denied: role '${role ?? "anonymous"}' cannot ${action} admin`);
  }
}

export function isAdmin(role: Role | null | undefined): boolean {
  return role === "ADMIN";
}
