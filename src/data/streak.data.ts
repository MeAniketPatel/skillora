import db from "@/lib/prisma";

export async function getStudyStreak(userId: string) {
  let streak = await db.studyStreak.findUnique({
    where: { userId },
  });

  if (!streak) {
    streak = await db.studyStreak.create({
      data: {
        userId,
        currentStreak: 0,
        longestStreak: 0,
        freezeCount: 0,
      },
    });
  }

  return streak;
}

export async function getStudySessions(userId: string) {
  return db.studySession.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });
}

export async function recordStudySession(userId: string, durationSeconds: number) {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  // 1. Record the session
  await db.studySession.create({
    data: {
      userId,
      duration: durationSeconds,
      date: now,
    },
  });

  // 2. Fetch/Create streak record
  const streak = await getStudyStreak(userId);

  if (!streak.lastActivityDate) {
    // First session ever
    return db.studyStreak.update({
      where: { userId },
      data: {
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: now,
      },
    });
  }

  const lastActivityStr = streak.lastActivityDate.toISOString().split("T")[0];

  if (lastActivityStr === todayStr) {
    // Already studied today, do not increment but update lastActivityDate to latest timestamp
    return db.studyStreak.update({
      where: { userId },
      data: {
        lastActivityDate: now,
      },
    });
  }

  const yesterday = new Date(Date.now() - 86400000);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  let newStreak = streak.currentStreak;

  if (lastActivityStr === yesterdayStr) {
    // Studied yesterday, increment streak
    newStreak += 1;
  } else {
    // Gap in study days. Check if we can use a streak freeze
    if (streak.freezeCount > 0) {
      // Use streak freeze: preserve current streak, decrement freeze count
      await db.studyStreak.update({
        where: { userId },
        data: {
          freezeCount: streak.freezeCount - 1,
        },
      });
    } else {
      // Streak reset
      newStreak = 1;
    }
  }

  return db.studyStreak.update({
    where: { userId },
    data: {
      currentStreak: newStreak,
      longestStreak: Math.max(streak.longestStreak, newStreak),
      lastActivityDate: now,
    },
  });
}

export async function buyStreakFreeze(userId: string, costPoints = 100) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { points: true },
  });

  if (!user || user.points < costPoints) {
    throw new Error("Insufficient points to buy streak freeze");
  }

  // Deduct points and increment freeze count in a transaction
  return db.$transaction([
    db.user.update({
      where: { id: userId },
      data: { points: { decrement: costPoints } },
    }),
    db.studyStreak.update({
      where: { userId },
      data: { freezeCount: { increment: 1 } },
    }),
  ]);
}
