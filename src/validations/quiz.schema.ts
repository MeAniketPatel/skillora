import { z } from "zod";

const quizOptionSchema = z.object({
  text: z.string().min(1),
  isCorrect: z.boolean(),
});

export const quizQuestionSchema = z.object({
  question: z.string().min(1),
  type: z.enum(["MULTIPLE_CHOICE", "MULTI_SELECT", "TRUE_FALSE", "SHORT_ANSWER"]).default("MULTIPLE_CHOICE"),
  options: z.array(quizOptionSchema).min(2),
  explanation: z.string().optional(),
  points: z.number().min(1).default(1),
});

export const quizCreateSchema = z.object({
  title: z.string().min(1),
  passingScore: z.number().min(0).max(100).default(70),
  timeLimit: z.number().min(1).optional(),
  maxAttempts: z.number().min(1).optional(),
});

export const quizUpdateSchema = z.object({
  title: z.string().min(1),
  passingScore: z.number().min(0).max(100),
  timeLimit: z.number().min(1).optional().or(z.null()),
  maxAttempts: z.number().min(1).optional().or(z.null()),
  questions: z.array(quizQuestionSchema),
});

export const quizSubmitSchema = z.object({
  quizId: z.string().min(1),
  answers: z.record(z.string(), z.string()),
});

export type QuizCreateInput = z.infer<typeof quizCreateSchema>;
export type QuizUpdateInput = z.infer<typeof quizUpdateSchema>;
export type QuizSubmitInput = z.infer<typeof quizSubmitSchema>;
