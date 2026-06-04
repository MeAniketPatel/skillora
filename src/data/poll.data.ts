import db from "@/lib/prisma";

export async function getCoursePolls(courseId: string) {
  return db.poll.findMany({
    where: { courseId },
    orderBy: { createdAt: "desc" },
    include: {
      options: {
        include: {
          votes: true,
        },
      },
    },
  });
}

export async function getPollById(pollId: string) {
  return db.poll.findUnique({
    where: { id: pollId },
    include: {
      options: {
        include: {
          votes: true,
        },
      },
    },
  });
}

export async function createPoll(
  userId: string,
  courseId: string,
  question: string,
  options: string[]
) {
  return db.poll.create({
    data: {
      userId,
      courseId,
      question,
      options: {
        create: options.map((text) => ({ text })),
      },
    },
  });
}

export async function voteInPoll(userId: string, pollId: string, optionId: string) {
  // Enforce one vote per poll per user:
  // Find any existing votes by this user in any option of this poll
  const existingVotes = await db.pollVote.findMany({
    where: {
      userId,
      option: {
        pollId,
      },
    },
  });

  if (existingVotes.length > 0) {
    // Delete existing votes
    await db.pollVote.deleteMany({
      where: {
        id: { in: existingVotes.map((v) => v.id) },
      },
    });
  }

  // Create new vote
  return db.pollVote.create({
    data: {
      userId,
      optionId,
    },
  });
}

export async function closePoll(pollId: string) {
  return db.poll.update({
    where: { id: pollId },
    data: { closedAt: new Date() },
  });
}

export async function deletePoll(pollId: string) {
  return db.poll.delete({
    where: { id: pollId },
  });
}
