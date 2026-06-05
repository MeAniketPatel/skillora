// Auto-generated barrel: re-exports all repositories for the attachments feature.
export * from "./repositories/attachment.repository";

// Services
export { attachmentsService } from "./services/attachments.service";
export type { AttachmentsService } from "./services/attachments.service";

// Permissions
export { canAttachments as canAttachments, assertAttachmentsAccess } from "./permissions/attachments.permissions";
