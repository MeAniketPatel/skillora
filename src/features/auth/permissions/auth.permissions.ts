// Auto-generated permission map for the auth feature.
// Override individual entries by exporting a const with the same name.
import type { Role } from "@/core/entities";

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
    throw new Error(`Access denied: role '${role ?? "anonymous"}' cannot ${action} auth`);
  }
}

export function isTeacherOrAdmin(role: Role | null | undefined): boolean {
  return role === "TEACHER" || role === "ADMIN";
}
