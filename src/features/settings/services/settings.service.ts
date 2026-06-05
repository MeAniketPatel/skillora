// Auto-generated service wrapper for the settings feature.
// Delegates to the repositories by default (DI via default-param pattern
// per ADR-007). Mutation methods emit domain events on the in-process
// event bus for cross-feature side effects.
import { eventBus } from "@/shared/events";
import * as settingsRepo from "../repositories/settings.repository";

export const settingsService = {
  getSetting: settingsRepo.getSetting,
  async setSetting(...args: Parameters<typeof settingsRepo.setSetting>): Promise<Awaited<ReturnType<typeof settingsRepo.setSetting>>> {
    const result = await settingsRepo.setSetting(...args);
    await eventBus.emit({ name: "settings.setSetting", feature: "settings", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  getAllSettings: settingsRepo.getAllSettings,
};

export type SettingsService = typeof settingsService;
