// Auto-generated permission map for the polls feature.
// Override individual entries by exporting a const with the same name.
import type { Role } from "@/core/entities";

export type AccessRule = Role[] | "PUBLIC";

export const canPolls: Record<string, AccessRule> = {
  view: ["TEACHER","STUDENT","ADMIN"],
  create: ["TEACHER","STUDENT","ADMIN"],
  update: ["TEACHER","ADMIN"],
  delete: ["ADMIN"],
};

export function assertPollsAccess(role: Role | null | undefined, action: keyof typeof canPolls = "view") {
  const rule = canPolls[action];
  if (rule === "PUBLIC") return;
  if (!role || !rule.includes(role)) {
    throw new Error(`Access denied: role '${role ?? "anonymous"}' cannot ${action} polls`);
  }
}
