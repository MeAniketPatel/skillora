import db from "@/shared/lib/prisma";

export async function createDeck(userId: string, title: string, description?: string) {
  return db.flashcardDeck.create({
    data: {
      userId,
      title,
      description,
    },
  });
}

export async function addCardToDeck(deckId: string, front: string, back: string) {
  return db.flashcard.create({
    data: {
      deckId,
      front,
      back,
    },
  });
}

export async function getDecksForUser(userId: string) {
  return db.flashcardDeck.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          flashcards: true,
        },
      },
    },
  });
}

export async function getDeckDetails(deckId: string) {
  return db.flashcardDeck.findUnique({
    where: { id: deckId },
    include: {
      flashcards: {
        include: {
          progress: true,
        },
      },
    },
  });
}

export async function getReviewCardsForUser(userId: string) {
  const now = new Date();

  // Return cards where there is either no progress logged yet, or nextStudyAt <= now
  return db.flashcard.findMany({
    where: {
      deck: {
        userId,
      },
      OR: [
        {
          progress: {
            none: {
              userId,
            },
          },
        },
        {
          progress: {
            some: {
              userId,
              nextStudyAt: {
                lte: now,
              },
            },
          },
        },
      ],
    },
    include: {
      deck: {
        select: {
          title: true,
        },
      },
      progress: {
        where: {
          userId,
        },
      },
    },
  });
}

export async function getSpacedRepetitionProgress(flashcardId: string, userId: string) {
  return db.spacedRepetitionProgress.findUnique({
    where: {
      flashcardId_userId: {
        flashcardId,
        userId,
      },
    },
  });
}

export async function updateCardRepetitionProgress(userId: string, cardId: string, score: number) {
  const existing = await getSpacedRepetitionProgress(cardId, userId);

  let interval = 1;
  let easeFactor = 2.5;
  let repetitions = 0;

  if (existing) {
    easeFactor = existing.easeFactor;
    repetitions = existing.repetitions;
    interval = existing.interval;
  }

  // SuperMemo-2 (SM-2) Spaced Repetition Calculations
  if (score >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  // Adjust Ease Factor (EF)
  easeFactor = easeFactor + (0.1 - (5 - score) * (0.08 + (5 - score) * 0.02));
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  const nextStudyAt = new Date();
  nextStudyAt.setDate(nextStudyAt.getDate() + interval);

  return db.spacedRepetitionProgress.upsert({
    where: {
      flashcardId_userId: {
        flashcardId: cardId,
        userId,
      },
    },
    update: {
      interval,
      easeFactor,
      repetitions,
      nextStudyAt,
    },
    create: {
      flashcardId: cardId,
      userId,
      interval,
      easeFactor,
      repetitions,
      nextStudyAt,
    },
  });
}
