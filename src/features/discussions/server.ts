// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.

// Repository functions
export { getDiscussionsList, getDiscussionThread, createDiscussion, addDiscussionReply, togglePinDiscussion, toggleLockDiscussion } from "./repositories/discussion.repository";
export { createQuestion, createAnswer, getQuestionsForLesson, getQuestionsForTeacher, markQuestionResolved, acceptAnswer } from "./repositories/qa.repository";

// Service

// Service
import { discussionsService as service } from "./services/discussions.service";
export { service };

export * from './permissions/discussions.permissions';

export * from './index';
