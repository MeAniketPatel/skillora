// Auto-generated barrel: re-exports all repositories for the attachments feature.
export * from "./repositories/attachment.repository";

// Services
export { attachmentsService } from "./services/attachments.service";
export type { AttachmentsService } from "./services/attachments.service";

// Permissions
export { canAttachments as canAttachments, assertAttachmentsAccess } from "./permissions/attachments.permissions";

// Contracts
export { createAttachmentsSchema, updateAttachmentsSchema, listAttachmentsQuerySchema } from "./contracts/attachments.contract";
export type { CreateAttachmentsInput, UpdateAttachmentsInput, ListAttachmentsQuery } from "./contracts/attachments.contract";

// Hooks
export {  useAttachmentsList, useAttachmentsDetail, useAttachmentsCreate, useAttachmentsUpdate, useAttachmentsDelete } from "./hooks/use-attachments";

