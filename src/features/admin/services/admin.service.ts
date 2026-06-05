import * as commands from "./commands/commands";
import * as queries from "./queries/queries";

export const adminService = {
  ...queries,
  ...commands,
};

export type AdminService = typeof adminService;
