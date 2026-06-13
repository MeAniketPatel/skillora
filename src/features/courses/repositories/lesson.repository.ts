import db from "@/shared/lib/prisma";

export async function createLesson(sectionId: string, title: string) {
  const lastLesson = await db.lesson.findFirst({
    where: { sectionId },
    orderBy: { position: "desc" },
  });

  const newPosition = lastLesson ? lastLesson.position + 1 : 1;

  return db.lesson.create({
    data: {
      title,
      sectionId,
      position: newPosition,
      type: "ARTICLE",
    },
  });
}

export async function updateLesson(lessonId: string, sectionId: string, data: any) {
  return db.lesson.update({
    where: { id: lessonId, sectionId },
    data,
  });
}

export async function deleteLesson(lessonId: string, sectionId: string) {
  return db.$transaction(async (tx) => {
    await tx.lessonProgress.deleteMany({ where: { lessonId } });
    await tx.note.deleteMany({ where: { lessonId } });
    await tx.question.deleteMany({ where: { lessonId } });
    return tx.lesson.delete({
      where: { id: lessonId, sectionId },
    });
  });
}

export async function reorderLessons(sectionId: string, items: { id: string; position: number }[]) {
  return db.$transaction(async (tx) => {
    const updates = items.map((item) =>
      tx.lesson.update({
        where: { id: item.id, sectionId },
        data: { position: item.position },
      })
    );
    return Promise.all(updates);
  });
}

export async function getLessonWithContent(lessonId: string) {
  return db.lesson.findUnique({
    where: { id: lessonId },
    include: {
      attachments: true,
      quiz: {
        include: {
          questions: {
            orderBy: { position: "asc" },
          },
        },
      },
    },
  });
}

export async function getLessonWithSection(lessonId: string) {
  return db.lesson.findUnique({
    where: { id: lessonId },
    include: { section: true },
  });
}

export async function getLessonWithCourse(lessonId: string) {
  return db.lesson.findUnique({
    where: { id: lessonId },
    include: { section: { include: { course: true } } },
  });
}

export async function getLearningLesson(lessonId: string, courseId: string, userId: string) {
  return db.lesson.findFirst({
    where: { id: lessonId, section: { courseId } },
    include: {
      attachments: {
        orderBy: { createdAt: "desc" },
      },
      quiz: {
        include: {
          questions: {
            orderBy: { position: "asc" },
          },
          attempts: {
            where: { userId },
            orderBy: { startedAt: "desc" },
          },
        },
      },
    },
  });
}

