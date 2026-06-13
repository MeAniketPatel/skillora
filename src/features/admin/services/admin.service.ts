import * as queries from "./queries/queries";

export const adminService = {
  ...queries,
};

export type AdminService = typeof adminService;
