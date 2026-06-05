import * as commands from "./commands/commands";
import * as queries from "./queries/queries";

export const coursesService = {
  ...queries,
  ...commands,
};

export type CoursesService = typeof coursesService;

