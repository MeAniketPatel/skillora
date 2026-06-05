import { eventBus } from "@/shared/events";
import db from "@/shared/lib/prisma";
import * as discussionRepo from "../../repositories/discussion.repository";
import * as qaRepo from "../../repositories/qa.repository";

export async function createDiscussion(...args: Parameters<typeof discussionRepo.createDiscussion>): Promise<Awaited<ReturnType<typeof discussionRepo.createDiscussion>>> {
  const result = await discussionRepo.createDiscussion(...args);
  await eventBus.emit({ name: "discussions.createDiscussion", feature: "discussions", payload: { result, args }, occurredAt: new Date() } as any);
  return result;
}

export async function addDiscussionReply(...args: Parameters<typeof discussionRepo.addDiscussionReply>): Promise<Awaited<ReturnType<typeof discussionRepo.addDiscussionReply>>> {
  const result = await discussionRepo.addDiscussionReply(...args);
  await eventBus.emit({ name: "discussions.addDiscussionReply", feature: "discussions", payload: { result, args }, occurredAt: new Date() } as any);
  return result;
}

export async function togglePinDiscussion(...args: Parameters<typeof discussionRepo.togglePinDiscussion>): Promise<Awaited<ReturnType<typeof discussionRepo.togglePinDiscussion>>> {
  const result = await discussionRepo.togglePinDiscussion(...args);
  await eventBus.emit({ name: "discussions.togglePinDiscussion", feature: "discussions", payload: { result, args }, occurredAt: new Date() } as any);
  return result;
}

export async function toggleLockDiscussion(...args: Parameters<typeof discussionRepo.toggleLockDiscussion>): Promise<Awaited<ReturnType<typeof discussionRepo.toggleLockDiscussion>>> {
  const result = await discussionRepo.toggleLockDiscussion(...args);
  await eventBus.emit({ name: "discussions.toggleLockDiscussion", feature: "discussions", payload: { result, args }, occurredAt: new Date() } as any);
  return result;
}

export async function createQuestion(...args: Parameters<typeof qaRepo.createQuestion>): Promise<Awaited<ReturnType<typeof qaRepo.createQuestion>>> {
  const result = await qaRepo.createQuestion(...args);
  await eventBus.emit({ name: "discussions.createQuestion", feature: "discussions", payload: { result, args }, occurredAt: new Date() } as any);
  return result;
}

export async function createAnswer(...args: Parameters<typeof qaRepo.createAnswer>): Promise<Awaited<ReturnType<typeof qaRepo.createAnswer>>> {
  const result = await qaRepo.createAnswer(...args);
  await eventBus.emit({ name: "discussions.createAnswer", feature: "discussions", payload: { result, args }, occurredAt: new Date() } as any);
  return result;
}

export async function markQuestionResolved(...args: Parameters<typeof qaRepo.markQuestionResolved>): Promise<Awaited<ReturnType<typeof qaRepo.markQuestionResolved>>> {
  const result = await qaRepo.markQuestionResolved(...args);
  await eventBus.emit({ name: "discussions.markQuestionResolved", feature: "discussions", payload: { result, args }, occurredAt: new Date() } as any);
  return result;
}

export async function acceptAnswer(answerId: string, questionId: string): Promise<any> {
  const result = await db.$transaction(async (tx) => {
    return qaRepo.acceptAnswer(answerId, questionId, tx);
  });
  await eventBus.emit({ name: "discussions.acceptAnswer", feature: "discussions", payload: { result, args: [answerId, questionId] }, occurredAt: new Date() } as any);
  return result;
}
