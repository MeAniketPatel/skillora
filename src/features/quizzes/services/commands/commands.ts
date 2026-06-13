import { eventBus } from "@/shared/events";
import * as quizRepo from "../../repositories/quiz.repository";

export async function createQuiz(...args: Parameters<typeof quizRepo.createQuiz>): Promise<Awaited<ReturnType<typeof quizRepo.createQuiz>>> {
  const result = await quizRepo.createQuiz(...args);
  await eventBus.emit({ name: "quizzes.createQuiz", feature: "quizzes", payload: { result, args }, occurredAt: new Date() } as any);
  return result;
}

export async function updateQuizWithQuestions(quizId: string, data: any, questions: any[]): Promise<any> {
  const result = await quizRepo.updateQuizWithQuestions(quizId, data, questions);
  await eventBus.emit({ name: "quizzes.updateQuizWithQuestions", feature: "quizzes", payload: { result, args: [quizId, data, questions] }, occurredAt: new Date() } as any);
  return result;
}

export async function submitQuizAttempt(quizId: string, userId: string, answers: Record<string, string>): Promise<any> {
  const quiz = await quizRepo.getQuizWithQuestions(quizId);
  if (!quiz) throw new Error("Quiz not found");

  let totalPoints = 0;
  let earnedPoints = 0;

  quiz.questions.forEach((q) => {
    totalPoints += q.points;
    const parsedOpts = typeof q.options === "string" ? (() => { try { return JSON.parse(q.options); } catch { return []; } })() : Array.isArray(q.options) ? q.options : [];
    const opts = parsedOpts as { text: string; isCorrect: boolean }[];
    const correctOpt = opts.find((o) => o.isCorrect);
    const studentAns = answers[q.id];

    if (correctOpt && studentAns === correctOpt.text) {
      earnedPoints += q.points;
    }
  });

  const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
  const passed = score >= quiz.passingScore;

  const result = await quizRepo.createQuizAttempt({
    quizId,
    userId,
    score,
    passed,
    answers: answers as any,
  });

  await eventBus.emit({ name: "quizzes.submitQuizAttempt", feature: "quizzes", payload: { result, args: { quizId, userId, answers } }, occurredAt: new Date() } as any);
  return result;
}
