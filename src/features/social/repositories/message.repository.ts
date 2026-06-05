import db from "@/shared/lib/prisma";

export async function getConversations(userId: string) {
  return db.conversation.findMany({
    where: {
      participants: {
        some: {
          userId,
        },
      },
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
            },
          },
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1, // latest message for previews
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getOrCreateConversation(userId1: string, userId2: string) {
  // Find a conversation containing both users
  const existing = await db.conversation.findFirst({
    where: {
      AND: [
        { participants: { some: { userId: userId1 } } },
        { participants: { some: { userId: userId2 } } },
      ],
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (existing) return existing;

  // Create new conversation
  return db.conversation.create({
    data: {
      participants: {
        createMany: {
          data: [
            { userId: userId1 },
            { userId: userId2 },
          ],
        },
      },
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
            },
          },
        },
      },
    },
  });
}

export async function getMessages(conversationId: string) {
  return db.directMessage.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
}

export async function sendDirectMessage(conversationId: string, senderId: string, content: string) {
  const msg = await db.directMessage.create({
    data: {
      conversationId,
      senderId,
      content,
    },
  });

  // Touch the conversation updated timestamp
  await db.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  return msg;
}
