// Auto-generated barrel: re-exports all repositories for the discussions feature.

// Components
export { DiscussionEditor } from "./components/discussion-editor";
export { DiscussionList } from "./components/discussion-list";
export { DiscussionReply } from "./components/discussion-reply";

// Permissions
export { canDiscussions as canDiscussions, assertDiscussionsAccess } from "./permissions/discussions.permissions";




// Contracts
export { createDiscussionSchema, discussionReplySchema } from "./contracts/discussion.contract";
export { createDiscussionsSchema, updateDiscussionsSchema, listDiscussionsQuerySchema } from "./contracts/discussions.contract";
export type { CreateDiscussionsInput, UpdateDiscussionsInput } from "./contracts/discussions.contract";

export { getDiscussionsList, getDiscussionThread, getQuestionsForTeacher, service } from "./server";
