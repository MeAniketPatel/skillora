import db from "@/lib/prisma";

export async function getStudyGroups() {
  return db.studyGroup.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          members: true,
        },
      },
    },
  });
}

export async function createStudyGroup(creatorId: string, name: string, description?: string, isPrivate = false) {
  const group = await db.studyGroup.create({
    data: {
      name,
      description,
      isPrivate,
      creatorId,
    },
  });

  // Creator automatically joins as CREATOR role
  await db.studyGroupMember.create({
    data: {
      studyGroupId: group.id,
      userId: creatorId,
      role: "CREATOR",
    },
  });

  return group;
}

export async function getStudyGroupById(id: string) {
  return db.studyGroup.findUnique({
    where: { id },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
      messages: {
        orderBy: { createdAt: "asc" },
        take: 100, // limit to last 100 messages
      },
    },
  });
}

export async function isGroupMember(studyGroupId: string, userId: string) {
  const member = await db.studyGroupMember.findUnique({
    where: {
      studyGroupId_userId: {
        studyGroupId,
        userId,
      },
    },
  });
  return !!member;
}

export async function joinStudyGroup(studyGroupId: string, userId: string) {
  const existing = await isGroupMember(studyGroupId, userId);
  if (existing) return null;
  return db.studyGroupMember.create({
    data: {
      studyGroupId,
      userId,
      role: "MEMBER",
    },
  });
}

export async function leaveStudyGroup(studyGroupId: string, userId: string) {
  return db.studyGroupMember.deleteMany({
    where: {
      studyGroupId,
      userId,
    },
  });
}

export async function sendStudyGroupMessage(studyGroupId: string, senderId: string, content: string) {
  return db.studyGroupMessage.create({
    data: {
      studyGroupId,
      senderId,
      content,
    },
  });
}
