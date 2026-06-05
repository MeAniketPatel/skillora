// Auto-generated service wrapper for the email-preferences feature.
// Delegates to the repositories by default (DI via default-param pattern
// per ADR-007). Mutation methods emit domain events on the in-process
// event bus for cross-feature side effects.
import { eventBus } from "@/shared/events";
import * as emailPreferenceRepo from "../repositories/email-preference.repository";

export const emailPreferencesService = {
  getEmailPreferences: emailPreferenceRepo.getEmailPreferences,
  async updateEmailPreferences(...args: Parameters<typeof emailPreferenceRepo.updateEmailPreferences>): Promise<Awaited<ReturnType<typeof emailPreferenceRepo.updateEmailPreferences>>> {
    const result = await emailPreferenceRepo.updateEmailPreferences(...args);
    await eventBus.emit({ name: "email-preferences.updateEmailPreferences", feature: "email-preferences", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
};

export type EmailPreferencesService = typeof emailPreferencesService;
