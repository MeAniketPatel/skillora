import db from "@/shared/lib/prisma";
import { ForbiddenError, NotFoundError } from "@/shared/lib/errors";

export async function createSection(courseId: string, title: string, ownerId?: string) {
  if (ownerId) {
    const course = await db.course.findUnique({
      where: { id: courseId },
      select: { teacherId: true },
    });
    if (!course) throw new NotFoundError("Course not found");
    if (course.teacherId !== ownerId) {
      throw new ForbiddenError("You do not own this course");
    }
  }

  const lastSection = await db.section.findFirst({
    where: { courseId },
    orderBy: { position: "desc" },
  });

  const newPosition = lastSection ? lastSection.position + 1 : 1;

  return db.section.create({
    data: {
      title,
      courseId,
      position: newPosition,
    },
  });
}

export async function updateSection(sectionId: string, courseId: string, data: { title: string }) {
  return db.section.update({
    where: { id: sectionId, courseId },
    data,
  });
}

export async function deleteSection(sectionId: string, courseId: string) {
  return db.$transaction(async (tx) => {
    const lessons = await tx.lesson.findMany({
      where: { sectionId },
      select: { id: true },
    });
    const lessonIds = lessons.map((l) => l.id);
    if (lessonIds.length > 0) {
      await tx.lessonProgress.deleteMany({ where: { lessonId: { in: lessonIds } } });
      await tx.note.deleteMany({ where: { lessonId: { in: lessonIds } } });
      await tx.question.deleteMany({ where: { lessonId: { in: lessonIds } } });
    }
    return tx.section.delete({
      where: { id: sectionId, courseId },
    });
  });
}

export async function reorderSections(courseId: string, items: { id: string; position: number }[]) {
  return db.$transaction(async (tx) => {
    const updates = items.map((item) =>
      tx.section.update({
        where: { id: item.id, courseId },
        data: { position: item.position },
      })
    );
    return Promise.all(updates);
  });
}
