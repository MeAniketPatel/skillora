// Auto-generated permission map for the gift-cards feature.
// Override individual entries by exporting a const with the same name.
import type { Role } from "@/core/entities";

export type AccessRule = Role[] | "PUBLIC";

export const canGiftCards: Record<string, AccessRule> = {
  view: ["STUDENT","ADMIN"],
  create: ["STUDENT","ADMIN"],
  update: ["ADMIN"],
  delete: ["ADMIN"],
};

export function assertGiftCardsAccess(role: Role | null | undefined, action: keyof typeof canGiftCards = "view") {
  const rule = canGiftCards[action];
  if (rule === "PUBLIC") return;
  if (!role || !rule.includes(role)) {
    throw new Error(`Access denied: role '${role ?? "anonymous"}' cannot ${action} gift-cards`);
  }
}
