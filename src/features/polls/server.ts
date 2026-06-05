// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.

// Repository functions
export { getCoursePolls, getPollById, createPoll, voteInPoll, closePoll, deletePoll } from "./repositories/poll.repository";
