// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.

// Repository functions
export { getDiscussionsList, getDiscussionThread, createDiscussion, addDiscussionReply, togglePinDiscussion, toggleLockDiscussion } from "./repositories/discussion.repository";
export { createQuestion, createAnswer, getQuestionsForLesson, getQuestionsForTeacher, markQuestionResolved, acceptAnswer } from "./repositories/qa.repository";
