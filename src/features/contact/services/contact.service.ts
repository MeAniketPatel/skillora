// Auto-generated service wrapper for the contact feature.
// Delegates to the repositories by default (DI via default-param pattern
// per ADR-007). Mutation methods emit domain events on the in-process
// event bus for cross-feature side effects.
import { eventBus } from "@/shared/events";
import * as contactRepo from "../repositories/contact.repository";

export const contactService = {
  async createContactMessage(...args: Parameters<typeof contactRepo.createContactMessage>): Promise<Awaited<ReturnType<typeof contactRepo.createContactMessage>>> {
    const result = await contactRepo.createContactMessage(...args);
    await eventBus.emit({ name: "contact.createContactMessage", feature: "contact", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  getContactMessages: contactRepo.getContactMessages,
  async markContactMessageReplied(...args: Parameters<typeof contactRepo.markContactMessageReplied>): Promise<Awaited<ReturnType<typeof contactRepo.markContactMessageReplied>>> {
    const result = await contactRepo.markContactMessageReplied(...args);
    await eventBus.emit({ name: "contact.markContactMessageReplied", feature: "contact", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
};

export type ContactService = typeof contactService;
