import { eventBus } from "@/shared/events";
import * as attachmentRepo from "../repositories/attachment.repository";

export const attachmentsService = {
  async createAttachment(...args: Parameters<typeof attachmentRepo.createAttachment>): Promise<Awaited<ReturnType<typeof attachmentRepo.createAttachment>>> {
    const result = await attachmentRepo.createAttachment(...args);
    await eventBus.emit({ name: "attachments.createAttachment", feature: "attachments", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  async deleteAttachment(...args: Parameters<typeof attachmentRepo.deleteAttachment>): Promise<Awaited<ReturnType<typeof attachmentRepo.deleteAttachment>>> {
    const result = await attachmentRepo.deleteAttachment(...args);
    await eventBus.emit({ name: "attachments.deleteAttachment", feature: "attachments", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
};

export type AttachmentsService = typeof attachmentsService;
