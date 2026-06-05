// Auto-generated barrel: re-exports all repositories for the discussions feature.

// Components
export { DiscussionEditor } from "./components/discussion-editor";
export { DiscussionList } from "./components/discussion-list";
export { DiscussionReply } from "./components/discussion-reply";

// Permissions
export { canDiscussions as canDiscussions, assertDiscussionsAccess } from "./permissions/discussions.permissions";

// Contracts
export { createDiscussionsSchema, updateDiscussionsSchema, listDiscussionsQuerySchema } from "./contracts/discussions.contract";
export type { CreateDiscussionsInput, UpdateDiscussionsInput, ListDiscussionsQuery } from "./contracts/discussions.contract";

// Hooks
export {  useDiscussionsList, useDiscussionsDetail, useDiscussionsCreate, useDiscussionsUpdate, useDiscussionsDelete } from "./hooks/use-discussions";

