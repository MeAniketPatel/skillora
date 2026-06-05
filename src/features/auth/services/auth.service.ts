// Auto-generated service wrapper for the auth feature.
// Delegates to the repositories by default (DI via default-param pattern
// per ADR-007). Mutation methods emit domain events on the in-process
// event bus for cross-feature side effects.
import { eventBus } from "@/shared/events";
import * as userRepo from "../repositories/user.repository";

export const authService = {
  getUserById: userRepo.getUserById,
  getUserByEmail: userRepo.getUserByEmail,
  async createUser(...args: Parameters<typeof userRepo.createUser>): Promise<Awaited<ReturnType<typeof userRepo.createUser>>> {
    const result = await userRepo.createUser(...args);
    await eventBus.emit({ name: "auth.createUser", feature: "auth", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  getUserProfile: userRepo.getUserProfile,
  getAllUsers: userRepo.getAllUsers,
  getUserCount: userRepo.getUserCount,
  getUserCountByRole: userRepo.getUserCountByRole,
  async updateUser(...args: Parameters<typeof userRepo.updateUser>): Promise<Awaited<ReturnType<typeof userRepo.updateUser>>> {
    const result = await userRepo.updateUser(...args);
    await eventBus.emit({ name: "auth.updateUser", feature: "auth", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async banUser(...args: Parameters<typeof userRepo.banUser>): Promise<Awaited<ReturnType<typeof userRepo.banUser>>> {
    const result = await userRepo.banUser(...args);
    await eventBus.emit({ name: "auth.banUser", feature: "auth", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async unbanUser(...args: Parameters<typeof userRepo.unbanUser>): Promise<Awaited<ReturnType<typeof userRepo.unbanUser>>> {
    const result = await userRepo.unbanUser(...args);
    await eventBus.emit({ name: "auth.unbanUser", feature: "auth", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  getUserGrowthTimeline: userRepo.getUserGrowthTimeline,
  getAllInstructors: userRepo.getAllInstructors,
  getInstructorProfile: userRepo.getInstructorProfile,
};

export type AuthService = typeof authService;
