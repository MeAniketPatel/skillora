// Auto-generated permission map for the referrals feature.
// Override individual entries by exporting a const with the same name.
import type { Role } from "@/core/entities";

export type AccessRule = Role[] | "PUBLIC";

export const canReferrals: Record<string, AccessRule> = {
  view: ["STUDENT","ADMIN"],
  create: ["STUDENT","ADMIN"],
  update: ["ADMIN"],
  delete: ["ADMIN"],
};

export function assertReferralsAccess(role: Role | null | undefined, action: keyof typeof canReferrals = "view") {
  const rule = canReferrals[action];
  if (rule === "PUBLIC") return;
  if (!role || !rule.includes(role)) {
    throw new Error(`Access denied: role '${role ?? "anonymous"}' cannot ${action} referrals`);
  }
}
