// Auto-generated permission map for the webhooks feature.
// Override individual entries by exporting a const with the same name.
import type { Role } from "@/core/entities";

export type AccessRule = Role[] | "PUBLIC";

export const canWebhooks: Record<string, AccessRule> = {
  view: ["ADMIN"],
  create: ["ADMIN"],
  update: ["ADMIN"],
  delete: ["ADMIN"],
};

export function assertWebhooksAccess(role: Role | null | undefined, action: keyof typeof canWebhooks = "view") {
  const rule = canWebhooks[action];
  if (rule === "PUBLIC") return;
  if (!role || !rule.includes(role)) {
    throw new Error(`Access denied: role '${role ?? "anonymous"}' cannot ${action} webhooks`);
  }
}
