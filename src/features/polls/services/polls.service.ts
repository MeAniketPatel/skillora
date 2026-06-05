// Auto-generated service wrapper for the polls feature.
// Delegates to the repositories by default (DI via default-param pattern
// per ADR-007). Mutation methods emit domain events on the in-process
// event bus for cross-feature side effects.
import { eventBus } from "@/shared/events";
import * as pollRepo from "../repositories/poll.repository";

export const pollsService = {
  getCoursePolls: pollRepo.getCoursePolls,
  getPollById: pollRepo.getPollById,
  async createPoll(...args: Parameters<typeof pollRepo.createPoll>): Promise<Awaited<ReturnType<typeof pollRepo.createPoll>>> {
    const result = await pollRepo.createPoll(...args);
    await eventBus.emit({ name: "polls.createPoll", feature: "polls", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  voteInPoll: pollRepo.voteInPoll,
  closePoll: pollRepo.closePoll,
  async deletePoll(...args: Parameters<typeof pollRepo.deletePoll>): Promise<Awaited<ReturnType<typeof pollRepo.deletePoll>>> {
    const result = await pollRepo.deletePoll(...args);
    await eventBus.emit({ name: "polls.deletePoll", feature: "polls", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
};

export type PollsService = typeof pollsService;
