// Auto-generated permission map for the teachers feature.
// Override individual entries by exporting a const with the same name.
import type { Role } from "@/core/entities";

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
    throw new Error(`Access denied: role '${role ?? "anonymous"}' cannot ${action} teachers`);
  }
}
