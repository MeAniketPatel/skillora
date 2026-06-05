import * as commands from "./commands/commands";
import * as queries from "./queries/queries";

export const discussionsService = {
  ...queries,
  ...commands,
};

export type DiscussionsService = typeof discussionsService;
