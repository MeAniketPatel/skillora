// Auto-generated permission map for the feature-flags feature.
// Override individual entries by exporting a const with the same name.
import type { Role } from "@/core/entities";

export type AccessRule = Role[] | "PUBLIC";

export const canFeatureFlags: Record<string, AccessRule> = {
  view: ["ADMIN"],
  create: ["ADMIN"],
  update: ["ADMIN"],
  delete: ["ADMIN"],
};

export function assertFeatureFlagsAccess(role: Role | null | undefined, action: keyof typeof canFeatureFlags = "view") {
  const rule = canFeatureFlags[action];
  if (rule === "PUBLIC") return;
  if (!role || !rule.includes(role)) {
    throw new Error(`Access denied: role '${role ?? "anonymous"}' cannot ${action} feature-flags`);
  }
}
