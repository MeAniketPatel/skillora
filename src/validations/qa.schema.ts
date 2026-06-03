import { z } from "zod";

export const questionCreateSchema = z.object({
  lessonId: z.string().min(1),
  title: z.string().min(5, "Title must be at least 5 characters"),
  body: z.string().min(10, "Body must be at least 10 characters"),
});

export const answerCreateSchema = z.object({
  questionId: z.string().min(1),
  body: z.string().min(5, "Answer must be at least 5 characters"),
});

export type QuestionCreateInput = z.infer<typeof questionCreateSchema>;
export type AnswerCreateInput = z.infer<typeof answerCreateSchema>;
