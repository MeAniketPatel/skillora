export type Role = "STUDENT" | "TEACHER" | "ADMIN";

export const ROLES = {
  STUDENT: "STUDENT",
  TEACHER: "TEACHER",
  ADMIN: "ADMIN",
} as const satisfies Record<Role, Role>;

export function isRole(value: unknown): value is Role {
  return value === "STUDENT" || value === "TEACHER" || value === "ADMIN";
}

export function isTeacher(role: Role | undefined | null): boolean {
  return role === "TEACHER" || role === "ADMIN";
}

export function isAdmin(role: Role | undefined | null): boolean {
  return role === "ADMIN";
}
