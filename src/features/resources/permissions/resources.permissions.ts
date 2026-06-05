import type { Role } from "@/core/entities";

export function assertResourceAccess(user: { id: string; role: Role }, courseTeacherId: string, action: "add" | "delete") {
  if (courseTeacherId !== user.id && user.role !== "ADMIN") {
    throw new Error(`You do not have permission to ${action} resources for this course.`);
  }
}
