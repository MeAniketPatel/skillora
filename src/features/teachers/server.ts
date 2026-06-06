// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.
// Client components (forms, dashboards, tables) must be imported from "@/features/teachers".

// Repository functions
export { getPayoutHistory, getPayoutBalance, createPayoutRequest } from "./repositories/payout.repository";

// Service
import { teachersService as service } from "./services/teachers.service";
export { service };

// Permissions (server-safe pure functions)
export * from "./permissions/teachers.permissions";

// Contracts (schemas + types — safe in both contexts)
export {
  createTeachersSchema,
  updateTeachersSchema,
  listTeachersQuerySchema,
} from "./contracts/teachers.contract";
export type {
  CreateTeachersInput,
  UpdateTeachersInput,
  ListTeachersQuery,
} from "./contracts/teachers.contract";
