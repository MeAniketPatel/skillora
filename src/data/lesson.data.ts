import db from "@/lib/prisma";

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
  return db.lesson.delete({
    where: { id: lessonId, sectionId },
  });
}

export async function reorderLessons(sectionId: string, items: { id: string; position: number }[]) {
  const updates = items.map((item) =>
    db.lesson.update({
      where: { id: item.id, sectionId },
      data: { position: item.position },
    })
  );
  return db.$transaction(updates);
}

export async function getLessonWithContent(lessonId: string) {
  return db.lesson.findUnique({
    where: { id: lessonId },
    include: {
      attachments: true,
      quiz: true,
    },
  });
}
