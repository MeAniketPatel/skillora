// Auto-generated barrel: re-exports all repositories for the attachments feature.

// Permissions
export { canAttachments as canAttachments, assertAttachmentsAccess } from "./permissions/attachments.permissions";

// Contracts
export { createAttachmentsSchema, updateAttachmentsSchema, listAttachmentsQuerySchema } from "./contracts/attachments.contract";
export type { CreateAttachmentsInput, UpdateAttachmentsInput, ListAttachmentsQuery } from "./contracts/attachments.contract";

