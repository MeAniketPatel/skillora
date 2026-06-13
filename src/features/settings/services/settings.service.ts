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
  updateUserPrivacySettings: settingsRepo.updateUserPrivacySettings,
  updateUserNotificationSettings: settingsRepo.updateUserNotificationSettings,
};

export type SettingsService = typeof settingsService;
