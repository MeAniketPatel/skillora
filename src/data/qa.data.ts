import db from "@/lib/prisma";

export async function createQuestion(userId: string, lessonId: string, title: string, body: string) {
  return db.question.create({
    data: { userId, lessonId, title, body },
  });
}

export async function createAnswer(userId: string, questionId: string, body: string) {
  return db.answer.create({
    data: { userId, questionId, body },
  });
}

export async function getQuestionsForLesson(lessonId: string, params: { page?: number; limit?: number }) {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  const [questions, total] = await Promise.all([
    db.question.findMany({
      where: { lessonId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, image: true, role: true } },
        answers: {
          orderBy: [
            { isAccepted: "desc" },
            { createdAt: "asc" }
          ],
          include: {
            user: { select: { name: true, image: true, role: true } },
          },
        },
      },
    }),
    db.question.count({ where: { lessonId } }),
  ]);

  return { questions, total, pages: Math.ceil(total / limit) };
}

export async function getQuestionsForTeacher(teacherId: string, params: { page?: number; limit?: number }) {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  const where = {
    lesson: {
      section: {
        course: { teacherId },
      },
    },
    isResolved: false,
  };

  const [questions, total] = await Promise.all([
    db.question.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        lesson: {
          select: {
            title: true,
            section: { select: { course: { select: { title: true, id: true } } } },
          },
        },
      },
    }),
    db.question.count({ where }),
  ]);

  return { questions, total, pages: Math.ceil(total / limit) };
}

export async function markQuestionResolved(questionId: string) {
  return db.question.update({
    where: { id: questionId },
    data: { isResolved: true },
  });
}

export async function acceptAnswer(answerId: string, questionId: string) {
  return db.$transaction([
    db.answer.updateMany({
      where: { questionId },
      data: { isAccepted: false },
    }),
    db.answer.update({
      where: { id: answerId },
      data: { isAccepted: true },
    }),
    db.question.update({
      where: { id: questionId },
      data: { isResolved: true },
    })
  ]);
}
