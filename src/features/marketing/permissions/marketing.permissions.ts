// Auto-generated permission map for the marketing feature.
// Override individual entries by exporting a const with the same name.
import type { Role } from "@/core/entities";

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
    throw new Error(`Access denied: role '${role ?? "anonymous"}' cannot ${action} marketing`);
  }
}
