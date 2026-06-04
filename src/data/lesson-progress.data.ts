import db from "@/lib/prisma";

export async function upsertLessonProgress(enrollmentId: string, lessonId: string, data: { isCompleted?: boolean; completedAt?: Date | null; videoPosition?: number }) {
  return db.lessonProgress.upsert({
    where: {
      enrollmentId_lessonId: { enrollmentId, lessonId },
    },
    update: data,
    create: {
      enrollmentId,
      lessonId,
      isCompleted: data.isCompleted ?? false,
      completedAt: data.completedAt,
      videoPosition: data.videoPosition,
    },
  });
}

export async function initializeEnrollmentProgress(enrollmentId: string, lessonIds: string[]) {
  if (lessonIds.length === 0) return null;
  return db.lessonProgress.createMany({
    data: lessonIds.map((lessonId) => ({
      enrollmentId,
      lessonId,
      isCompleted: false,
    })),
  });
}

export async function getProgressForEnrollment(enrollmentId: string) {
  return db.lessonProgress.findMany({
    where: { enrollmentId },
  });
}

export async function calculateCourseProgress(enrollmentId: string, courseId: string) {
  const totalLessons = await db.lesson.count({
    where: {
      section: { courseId },
      isPublished: true,
    },
  });

  if (totalLessons === 0) return 0;

  const completedLessons = await db.lessonProgress.count({
    where: {
      enrollmentId,
      isCompleted: true,
    },
  });

  return (completedLessons / totalLessons) * 100;
}

export async function getLessonProgress(enrollmentId: string, lessonId: string) {
  return db.lessonProgress.findUnique({
    where: {
      enrollmentId_lessonId: {
        enrollmentId,
        lessonId,
      },
    },
  });
}

export async function getUserCompletedLessonsCount(userId: string) {
  return db.lessonProgress.count({
    where: {
      enrollment: { userId },
      isCompleted: true,
    },
  });
}
