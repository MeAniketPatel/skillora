import db from "@/shared/lib/prisma";

export async function getUserGoals(userId: string) {
  return db.learningGoal.findMany({
    where: { userId },
    orderBy: { targetDate: "asc" },
  });
}

export async function createGoal(userId: string, data: { type: string; target: number; targetDate: Date }) {
  return db.learningGoal.create({
    data: {
      userId,
      type: data.type,
      target: data.target,
      targetDate: data.targetDate,
      current: 0,
    },
  });
}

export async function updateGoalProgress(goalId: string, userId: string, progress: number) {
  return db.learningGoal.update({
    where: { id: goalId, userId },
    data: {
      current: progress,
    },
  });
}

export async function deleteGoal(goalId: string, userId: string) {
  return db.learningGoal.delete({
    where: { id: goalId, userId },
  });
}
