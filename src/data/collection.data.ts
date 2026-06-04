import db from "@/lib/prisma";

export async function getUserCollections(userId: string) {
  return db.courseCollection.findMany({
    where: { userId },
    include: {
      courses: {
        include: {
          course: {
            include: {
              category: true,
              teacher: true,
              sections: {
                include: {
                  lessons: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createCollection(userId: string, data: { name: string; description?: string }) {
  return db.courseCollection.create({
    data: {
      userId,
      name: data.name,
      description: data.description,
    },
  });
}

export async function addCourseToCollection(collectionId: string, courseId: string) {
  // Check if already in collection
  const existing = await db.collectionCourse.findUnique({
    where: {
      collectionId_courseId: { collectionId, courseId },
    },
  });

  if (existing) return existing;

  return db.collectionCourse.create({
    data: {
      collectionId,
      courseId,
    },
  });
}

export async function removeCourseFromCollection(collectionId: string, courseId: string) {
  return db.collectionCourse.delete({
    where: {
      collectionId_courseId: { collectionId, courseId },
    },
  });
}

export async function deleteCollection(collectionId: string, userId: string) {
  return db.courseCollection.delete({
    where: { id: collectionId, userId },
  });
}
