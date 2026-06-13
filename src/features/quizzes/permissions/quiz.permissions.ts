import type { Role } from "@/core/entities";
import { ForbiddenError } from "@/shared/lib/errors";

export type AccessRule = Role[] | "PUBLIC";

export const canQuiz: Record<string, AccessRule> = {
  view: "PUBLIC",
  create: ["TEACHER", "ADMIN"],
  update: ["TEACHER", "ADMIN"],
  delete: ["TEACHER", "ADMIN"],
};

export function assertQuizAccess(role: Role | null | undefined, action: keyof typeof canQuiz = "view") {
  const rule = canQuiz[action];
  if (rule === "PUBLIC") return;
  if (!role || !rule.includes(role)) {
    throw new ForbiddenError(`Access denied: role '${role ?? "anonymous"}' cannot ${action} quizzes`);
  }
}
