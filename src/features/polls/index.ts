// Auto-generated barrel: re-exports all repositories for the polls feature.
export * from "./repositories/poll.repository";

// Components
export { PollCreator } from "./components/poll-creator";
export { PollList } from "./components/poll-list";
export { PollResults } from "./components/poll-results";
export { PollVoter } from "./components/poll-voter";

// Services
export { pollsService } from "./services/polls.service";
export type { PollsService } from "./services/polls.service";

// Permissions
export { canPolls as canPolls, assertPollsAccess } from "./permissions/polls.permissions";

// Contracts
export { createPollsSchema, updatePollsSchema, listPollsQuerySchema } from "./contracts/polls.contract";
export type { CreatePollsInput, UpdatePollsInput, ListPollsQuery } from "./contracts/polls.contract";

// Hooks
export {  usePollsList, usePollsDetail, usePollsCreate, usePollsUpdate, usePollsDelete } from "./hooks/use-polls";

