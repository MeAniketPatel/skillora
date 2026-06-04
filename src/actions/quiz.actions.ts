"use server";

import { actionHandler } from "@/lib/action-utils";
import { requireAuth, requireTeacher } from "@/lib/auth-helpers";
import { ConflictError, NotFoundError } from "@/lib/errors";
import {
  createQuiz as createQuizData,
  updateQuizWithQuestions,
  createQuizAttempt,
  getQuizByLessonId,
  getQuizWithQuestions
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

    const quiz = await getQuizWithQuestions(quizId);

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
