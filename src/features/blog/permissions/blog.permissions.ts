// Auto-generated permission map for the blog feature.
// Override individual entries by exporting a const with the same name.
import type { Role } from "@/core/entities";

export type AccessRule = Role[] | "PUBLIC";

export const canBlog: Record<string, AccessRule> = {
  view: "PUBLIC",
  create: ["ADMIN"],
  update: ["ADMIN"],
  delete: ["ADMIN"],
};

export function assertBlogAccess(role: Role | null | undefined, action: keyof typeof canBlog = "view") {
  const rule = canBlog[action];
  if (rule === "PUBLIC") return;
  if (!role || !rule.includes(role)) {
    throw new Error(`Access denied: role '${role ?? "anonymous"}' cannot ${action} blog`);
  }
}
