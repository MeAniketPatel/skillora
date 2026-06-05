import type { Role } from "@/core/entities";

export function assertLiveSessionDeleteAccess(user: { id: string; role: Role }, hostId: string) {
  if (hostId !== user.id && user.role !== "ADMIN") {
    throw new Error("You do not have permission to delete this session.");
  }
}
