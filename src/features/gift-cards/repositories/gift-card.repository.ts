import db from "@/shared/lib/prisma";

export async function createGiftCard(senderId: string, amount: number, code: string) {
  return db.giftCard.create({
    data: {
      code,
      amount,
      senderId,
    },
  });
}

export async function redeemGiftCard(code: string, receiverId: string) {
  const card = await db.giftCard.findUnique({
    where: { code },
  });

  if (!card) {
    throw new Error("Gift card not found.");
  }

  if (card.isRedeemed) {
    throw new Error("Gift card has already been redeemed.");
  }

  if (card.senderId === receiverId) {
    throw new Error("You cannot redeem your own gift card.");
  }

  // Redeem the card
  const updatedCard = await db.giftCard.update({
    where: { code },
    data: {
      isRedeemed: true,
      receiverId,
      redeemedAt: new Date(),
    },
  });

  // Award the gift card amount as points/balance multiplier to the receiver
  // Let's award points: $1 value = 100 points
  const pointsToAward = Math.round(card.amount * 100);
  await db.user.update({
    where: { id: receiverId },
    data: {
      points: {
        increment: pointsToAward,
      },
    },
  });

  return updatedCard;
}
