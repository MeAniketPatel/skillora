import db from "@/shared/lib/prisma";

export async function createNote(userId: string, lessonId: string, content: string, timestamp?: number) {
  return db.note.create({
    data: { userId, lessonId, content, timestamp },
  });
}

export async function updateNote(noteId: string, userId: string, content: string) {
  return db.note.update({
    where: { id: noteId, userId },
    data: { content },
  });
}

export async function deleteNote(noteId: string, userId: string) {
  return db.note.delete({
    where: { id: noteId, userId },
  });
}

export async function getNotesForLesson(userId: string, lessonId: string) {
  return db.note.findMany({
    where: { userId, lessonId },
    orderBy: { timestamp: "asc" },
  });
}

export async function getAllUserNotes(userId: string, params: { page?: number; limit?: number }) {
  const page = params.page || 1;
  const limit = params.limit || 20;
  const skip = (page - 1) * limit;

  const [notes, total] = await Promise.all([
    db.note.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        lesson: {
          select: {
            title: true,
            id: true,
            section: {
              select: {
                course: { select: { title: true, id: true, slug: true } },
              },
            },
          },
        },
      },
    }),
    db.note.count({ where: { userId } }),
  ]);

  return { notes, total, pages: Math.ceil(total / limit) };
}
