// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.

// Repository functions
export { createAttachment, deleteAttachment } from "./repositories/attachment.repository";

// Service

// Service
import { attachmentsService as service } from "./services/attachments.service";
export { service };

export * from './permissions/attachments.permissions';

export * from './index';
