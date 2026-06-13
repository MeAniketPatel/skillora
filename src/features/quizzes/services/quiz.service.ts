import * as commands from "./commands/commands";
import * as queries from "./queries/queries";

export const quizzesService = {
  ...queries,
  ...commands,
};

export type QuizzesService = typeof quizzesService;
