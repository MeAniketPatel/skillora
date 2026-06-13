"use server";

import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth, requireTeacher } from "@/shared/lib/auth-helpers";
import { ConflictError, ForbiddenError, NotFoundError } from "@/shared/lib/errors";
import { service as quizzesService } from "@/features/quizzes/server";
import { service as coursesService } from "@/features/courses/server";
import { quizCreateSchema, quizUpdateSchema, quizSubmitSchema } from "../contracts/quiz.contract";

export async function createQuiz(lessonId: string, title: string, passingScore = 70) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    const validated = quizCreateSchema.parse({ title, passingScore });

    const lesson = await coursesService.getLessonWithCourse(lessonId);
    if (!lesson) throw new NotFoundError("Lesson");
    if (lesson.section.course.teacherId !== user.id) {
      throw new ForbiddenError("You do not own this course");
    }

    const existing = await quizzesService.getQuizByLessonId(lessonId);
    if (existing) throw new ConflictError("Quiz already exists for this lesson");

    const quiz = await quizzesService.createQuiz(lessonId, validated);
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
    const user = await requireTeacher();
    const validated = quizUpdateSchema.parse({ title, passingScore, questions });

    const quiz = await quizzesService.getQuizWithQuestions(quizId);
    if (!quiz) throw new NotFoundError("Quiz");

    const lesson = await coursesService.getLessonWithCourse(quiz.lessonId);
    if (!lesson || lesson.section.course.teacherId !== user.id) {
      throw new ForbiddenError("You do not own this course");
    }

    const updated = await quizzesService.updateQuizWithQuestions(
      quizId,
      { title: validated.title, passingScore: validated.passingScore },
      validated.questions
    );

    return updated;
  });
}

export async function submitQuizAttempt(
  quizId: string,
  answers: Record<string, string>
) {
  return actionHandler(async () => {
    const user = await requireAuth();
    quizSubmitSchema.parse({ quizId, answers });

    const attempt = await quizzesService.submitQuizAttempt(quizId, user.id, answers);

    return attempt;
  });
}
