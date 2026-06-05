// Auto-generated permission map for the categories feature.
// Override individual entries by exporting a const with the same name.
import type { Role } from "@/core/entities";

export type AccessRule = Role[] | "PUBLIC";

export const canCategories: Record<string, AccessRule> = {
  view: "PUBLIC",
  create: ["ADMIN"],
  update: ["ADMIN"],
  delete: ["ADMIN"],
};

export function assertCategoriesAccess(role: Role | null | undefined, action: keyof typeof canCategories = "view") {
  const rule = canCategories[action];
  if (rule === "PUBLIC") return;
  if (!role || !rule.includes(role)) {
    throw new Error(`Access denied: role '${role ?? "anonymous"}' cannot ${action} categories`);
  }
}
