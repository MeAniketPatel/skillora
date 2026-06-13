import { z } from "zod";

export const createAssignmentsSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});

export const updateAssignmentsSchema = z.object({
  id: z.string(),
});

export const listAssignmentsQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export const submitAssignmentSchema = z.object({
  lessonId: z.string().min(1),
  content: z.string().min(1),
});

export const gradeSubmissionSchema = z.object({
  submissionId: z.string().min(1),
  score: z.number().min(0).max(100),
  feedback: z.string().optional(),
});

export type CreateAssignmentsInput = z.infer<typeof createAssignmentsSchema>;
export type UpdateAssignmentsInput = z.infer<typeof updateAssignmentsSchema>;
export type ListAssignmentsQuery = z.infer<typeof listAssignmentsQuerySchema>;
export type GradeSubmissionInput = z.infer<typeof gradeSubmissionSchema>;
