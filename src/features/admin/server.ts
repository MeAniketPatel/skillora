export { getAuditLogs } from "./repositories/audit.repository";

import { adminService as service } from "./services/admin.service";
export { service };

export * from './permissions/admin.permissions';

export * from './contracts/admin.contract';

export { updateUserRole, banUser, unbanUser } from "./actions/admin.actions";
