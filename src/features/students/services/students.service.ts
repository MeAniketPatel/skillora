import * as commands from "./commands/commands";
import * as queries from "./queries/queries";

export const studentsService = {
  ...queries,
  ...commands,
};

export type StudentsService = typeof studentsService;

