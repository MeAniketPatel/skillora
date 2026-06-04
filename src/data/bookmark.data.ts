import db from "@/lib/prisma";

export async function getUserBookmarks(userId: string) {
  return db.bookmark.findMany({
    where: { userId },
    include: {
      lesson: {
        include: {
          section: {
            include: {
              course: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function isBookmarked(userId: string, lessonId: string): Promise<boolean> {
  const bookmark = await db.bookmark.findUnique({
    where: {
      userId_lessonId: { userId, lessonId },
    },
  });
  return !!bookmark;
}

export async function toggleBookmark(userId: string, lessonId: string) {
  const existing = await db.bookmark.findUnique({
    where: {
      userId_lessonId: { userId, lessonId },
    },
  });

  if (existing) {
    await db.bookmark.delete({
      where: {
        userId_lessonId: { userId, lessonId },
      },
    });
    return { bookmarked: false };
  } else {
    await db.bookmark.create({
      data: {
        userId,
        lessonId,
      },
    });
    return { bookmarked: true };
  }
}
