import db from "@/shared/lib/prisma";

export async function getAnnouncementsByCourseId(courseId: string) {
  return db.announcement.findMany({
    where: { courseId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
}

export async function createAnnouncement(
  userId: string,
  courseId: string | null,
  title: string,
  content: string
) {
  return db.announcement.create({
    data: {
      userId,
      courseId,
      title,
      content,
    },
  });
}

export async function getAnnouncementById(id: string) {
  return db.announcement.findUnique({
    where: { id },
  });
}

export async function deleteAnnouncement(id: string) {
  return db.announcement.delete({
    where: { id },
  });
}

export async function getGlobalAnnouncements() {
  return db.announcement.findMany({
    where: { courseId: null },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
}

