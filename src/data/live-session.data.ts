import db from "@/shared/lib/prisma";

export async function getLiveSessions(courseId?: string) {
  return db.liveSession.findMany({
    where: courseId ? { courseId } : undefined,
    orderBy: {
      startTime: "asc",
    },
    include: {
      course: {
        select: {
          title: true,
        },
      },
      host: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
}

export async function getLiveSessionById(id: string) {
  return db.liveSession.findUnique({
    where: { id },
  });
}

export async function createLiveSession(data: {
  title: string;
  description?: string | null;
  meetUrl: string;
  startTime: Date;
  endTime: Date;
  courseId?: string | null;
  hostId: string;
}) {
  return db.liveSession.create({
    data: {
      title: data.title,
      description: data.description,
      meetUrl: data.meetUrl,
      startTime: data.startTime,
      endTime: data.endTime,
      courseId: data.courseId || null,
      hostId: data.hostId,
    },
  });
}

export async function deleteLiveSession(id: string) {
  return db.liveSession.delete({
    where: { id },
  });
}
