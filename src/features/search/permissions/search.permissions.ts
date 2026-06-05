// Auto-generated permission map for the search feature.
// Override individual entries by exporting a const with the same name.
import type { Role } from "@/core/entities";

export type AccessRule = Role[] | "PUBLIC";

export const canSearch: Record<string, AccessRule> = {
  view: "PUBLIC",
  create: ["STUDENT","TEACHER","ADMIN"],
  update: ["TEACHER","ADMIN"],
  delete: ["ADMIN"],
};

export function assertSearchAccess(role: Role | null | undefined, action: keyof typeof canSearch = "view") {
  const rule = canSearch[action];
  if (rule === "PUBLIC") return;
  if (!role || !rule.includes(role)) {
    throw new Error(`Access denied: role '${role ?? "anonymous"}' cannot ${action} search`);
  }
}
