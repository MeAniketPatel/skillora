import db from "@/lib/prisma";

export async function getLearningPaths() {
  return db.learningPath.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          courses: true,
          enrollments: true,
        },
      },
    },
  });
}

export async function getLearningPathDetail(pathId: string) {
  return db.learningPath.findUnique({
    where: { id: pathId },
    include: {
      courses: {
        orderBy: { position: "asc" },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              shortDescription: true,
              thumbnail: true,
              slug: true,
              level: true,
            },
          },
        },
      },
      _count: {
        select: {
          enrollments: true,
        },
      },
    },
  });
}

export async function isEnrolledInPath(pathId: string, userId: string) {
  const enrollment = await db.pathEnrollment.findUnique({
    where: {
      learningPathId_userId: {
        learningPathId: pathId,
        userId,
      },
    },
  });
  return !!enrollment;
}

export async function enrollInLearningPath(pathId: string, userId: string) {
  const existing = await isEnrolledInPath(pathId, userId);
  if (existing) return null;

  return db.pathEnrollment.create({
    data: {
      learningPathId: pathId,
      userId,
      progress: 0,
    },
  });
}

export async function getPathEnrollment(pathId: string, userId: string) {
  return db.pathEnrollment.findUnique({
    where: {
      learningPathId_userId: {
        learningPathId: pathId,
        userId,
      },
    },
  });
}

export async function updatePathProgress(pathId: string, userId: string, progress: number) {
  return db.pathEnrollment.update({
    where: {
      learningPathId_userId: {
        learningPathId: pathId,
        userId,
      },
    },
    data: { progress },
  });
}
