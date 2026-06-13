import { teachersService as service } from "./services/teachers.service";
export { service };

export * from "./permissions/teachers.permissions";

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
