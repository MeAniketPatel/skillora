export { createAttachment, deleteAttachment } from "./repositories/attachment.repository";

import { attachmentsService as service } from "./services/attachments.service";
export { service };

export * from './permissions/attachments.permissions';

