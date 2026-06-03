"use server";

import { actionHandler } from "@/lib/action-utils";
import { requireAuth, requireTeacher } from "@/lib/auth-helpers";
import { ConflictError, NotFoundError } from "@/lib/errors";
import {
  createQuiz as createQuizData,
  updateQuizWithQuestions,
  createQuizAttempt,
  getQuizByLessonId
} from "@/data";

export async function createQuiz(lessonId: string, title: string, passingScore = 70) {
  return actionHandler(async () => {
    await requireTeacher();

    const existing = await getQuizByLessonId(lessonId);
    if (existing) throw new ConflictError("Quiz already exists for this lesson");

    const quiz = await createQuizData(lessonId, { title, passingScore });
    return quiz;
  });
}

export async function updateQuiz(
  quizId: string,
  title: string,
  passingScore: number,
  questions: {
    question: string;
    options: { text: string; isCorrect: boolean }[];
    explanation?: string;
  }[]
) {
  return actionHandler(async () => {
    await requireTeacher();

    const quiz = await updateQuizWithQuestions(
      quizId,
      { title, passingScore },
      questions
    );

    return quiz;
  });
}

export async function submitQuizAttempt(
  quizId: string,
  answers: Record<string, string> // maps questionId -> selectedOptionText
) {
  return actionHandler(async () => {
    const user = await requireAuth();

    // Since getQuizByLessonId is what we have, we might need a getQuizById, 
    // but we can just use prisma here if needed or add a new DAL function.
    // For simplicity I will just import db directly if the DAL is missing it
    const db = (await import("@/lib/prisma")).default;
    
    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });

    if (!quiz) throw new NotFoundError("Quiz");

    let totalPoints = 0;
    let earnedPoints = 0;

    quiz.questions.forEach((q) => {
      totalPoints += q.points;
      const opts = q.options as any as { text: string; isCorrect: boolean }[];
      const correctOpt = opts.find((o) => o.isCorrect);
      const studentAns = answers[q.id];

      if (correctOpt && studentAns === correctOpt.text) {
        earnedPoints += q.points;
      }
    });

    const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    const passed = score >= quiz.passingScore;

    const attempt = await createQuizAttempt({
      quizId,
      userId: user.id,
      score,
      passed,
      answers: answers as any,
    });

    return attempt;
  });
}
