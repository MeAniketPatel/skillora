"use server";

import { revalidatePath } from "next/cache";
import db from "@/lib/prisma";
import { auth } from "@/auth";

async function requireTeacher() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function createQuiz(lessonId: string, title: string, passingScore = 70) {
  try {
    await requireTeacher();

    const existing = await db.quiz.findUnique({ where: { lessonId } });
    if (existing) return { error: "Quiz already exists for this lesson" };

    const quiz = await db.quiz.create({
      data: {
        lessonId,
        title,
        passingScore,
      },
    });

    return { success: true, data: quiz };
  } catch (error: any) {
    return { error: error.message || "Failed to create quiz" };
  }
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
  try {
    await requireTeacher();

    // Start a transaction to replace questions
    const quiz = await db.$transaction(async (tx) => {
      // 1. Update quiz title & score
      const q = await tx.quiz.update({
        where: { id: quizId },
        data: { title, passingScore },
      });

      // 2. Delete existing questions
      await tx.quizQuestion.deleteMany({
        where: { quizId },
      });

      // 3. Insert new questions
      if (questions.length > 0) {
        await tx.quizQuestion.createMany({
          data: questions.map((item, index) => ({
            quizId,
            question: item.question,
            options: item.options as any,
            explanation: item.explanation || "",
            position: index + 1,
          })),
        });
      }

      return q;
    });

    return { success: true, data: quiz };
  } catch (error: any) {
    return { error: error.message || "Failed to update quiz" };
  }
}

export async function submitQuizAttempt(
  quizId: string,
  answers: Record<string, string> // maps questionId -> selectedOptionText
) {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Unauthorized" };

    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: true,
      },
    });

    if (!quiz) return { error: "Quiz not found" };

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

    const attempt = await db.quizAttempt.create({
      data: {
        quizId,
        userId: session.user.id,
        score,
        passed,
        answers: answers as any,
      },
    });

    return { success: true, attempt };
  } catch (error: any) {
    return { error: error.message || "Failed to submit attempt" };
  }
}
