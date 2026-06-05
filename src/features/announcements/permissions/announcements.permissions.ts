// Auto-generated permission map for the announcements feature.
// Override individual entries by exporting a const with the same name.
import type { Role } from "@/core/entities";

export type AccessRule = Role[] | "PUBLIC";

export const canAnnouncements: Record<string, AccessRule> = {
  view: ["TEACHER","ADMIN"],
  create: ["TEACHER","ADMIN"],
  update: ["TEACHER","ADMIN"],
  delete: ["ADMIN"],
};

export function assertAnnouncementsAccess(role: Role | null | undefined, action: keyof typeof canAnnouncements = "view") {
  const rule = canAnnouncements[action];
  if (rule === "PUBLIC") return;
  if (!role || !rule.includes(role)) {
    throw new Error(`Access denied: role '${role ?? "anonymous"}' cannot ${action} announcements`);
  }
}
