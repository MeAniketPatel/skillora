import db from "@/shared/lib/prisma";

export async function getDiscussionsList(category?: string) {
  return db.discussion.findMany({
    where: category ? { category } : {},
    orderBy: [
      { isPinned: "desc" },
      { createdAt: "desc" },
    ],
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          replies: true,
        },
      },
    },
  });
}

export async function getDiscussionThread(id: string) {
  return db.discussion.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          role: true,
        },
      },
      replies: {
        orderBy: { createdAt: "asc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              role: true,
            },
          },
        },
      },
    },
  });
}

export async function createDiscussion(userId: string, title: string, content: string, category: string) {
  return db.discussion.create({
    data: {
      userId,
      title,
      content,
      category,
    },
  });
}

export async function addDiscussionReply(discussionId: string, userId: string, content: string) {
  const reply = await db.discussionReply.create({
    data: {
      discussionId,
      userId,
      content,
    },
  });

  // Touch parent discussion to update its updatedAt field
  await db.discussion.update({
    where: { id: discussionId },
    data: { updatedAt: new Date() },
  });

  return reply;
}

export async function togglePinDiscussion(id: string, isPinned: boolean) {
  return db.discussion.update({
    where: { id },
    data: { isPinned },
  });
}

export async function toggleLockDiscussion(id: string, isLocked: boolean) {
  return db.discussion.update({
    where: { id },
    data: { isLocked },
  });
}
