import db from "@/shared/lib/prisma";

export async function getQuizByLessonId(lessonId: string) {
  return db.quiz.findUnique({
    where: { lessonId },
    include: {
      questions: {
        orderBy: { position: "asc" },
      },
    },
  });
}

export async function getQuizWithQuestions(quizId: string) {
  return db.quiz.findUnique({
    where: { id: quizId },
    include: { questions: true },
  });
}

export async function createQuiz(lessonId: string, data: { title: string; passingScore: number; timeLimit?: number; maxAttempts?: number }) {
  return db.quiz.create({
    data: {
      lessonId,
      ...data,
    },
  });
}

export async function updateQuizWithQuestions(quizId: string, data: any, questions: any[]) {
  const q = await db.quiz.update({
    where: { id: quizId },
    data,
  });

  await db.quizQuestion.deleteMany({
    where: { quizId },
  });

  if (questions.length > 0) {
    await db.quizQuestion.createMany({
      data: questions.map((item: any, index: number) => ({
        quizId,
        question: item.question,
        type: item.type || "MULTIPLE_CHOICE",
        options: item.options,
        explanation: item.explanation || "",
        points: item.points || 1,
        position: index + 1,
      })),
    });
  }

  return q;
}

export async function getQuizAttempts(quizId: string, userId?: string) {
  const where: any = { quizId };
  if (userId) where.userId = userId;

  return db.quizAttempt.findMany({
    where,
    orderBy: { startedAt: "desc" },
  });
}

export async function createQuizAttempt(data: any) {
  return db.quizAttempt.create({ data });
}
