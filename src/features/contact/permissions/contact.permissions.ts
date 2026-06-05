// Auto-generated permission map for the contact feature.
// Override individual entries by exporting a const with the same name.
import type { Role } from "@/core/entities";

export type AccessRule = Role[] | "PUBLIC";

export const canContact: Record<string, AccessRule> = {
  view: "PUBLIC",
  create: ["ADMIN"],
  update: ["ADMIN"],
  delete: ["ADMIN"],
};

export function assertContactAccess(role: Role | null | undefined, action: keyof typeof canContact = "view") {
  const rule = canContact[action];
  if (rule === "PUBLIC") return;
  if (!role || !rule.includes(role)) {
    throw new Error(`Access denied: role '${role ?? "anonymous"}' cannot ${action} contact`);
  }
}
