"use server";

import { z } from "zod";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { purchaseGiftCardSchema, redeemGiftCardSchema } from "@/features/gift-cards/contracts/gift-card.contract";
import { service as giftCardsService } from "@/features/gift-cards/server";
import { revalidatePath } from "next/cache";

import { assertGiftCardsAccess } from "@/features/gift-cards/permissions/gift-cards.permissions";
// Helper to generate a random 12 character code
function generateCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function purchaseGiftCardAction(values: z.infer<typeof purchaseGiftCardSchema>) {
  return actionHandler(async () => {
    const user = await requireAuth();
    assertGiftCardsAccess(user.role, "update");
    const validated = purchaseGiftCardSchema.parse(values);
    
    const code = generateCode();
    const giftCard = await giftCardsService.createGiftCard(user.id!, validated.amount, code);
    
    revalidatePath("/student/purchases");
    return giftCard;
  });
}

export async function redeemGiftCardAction(values: z.infer<typeof redeemGiftCardSchema>) {
  return actionHandler(async () => {
    const user = await requireAuth();
    assertGiftCardsAccess(user.role, "update");
    const validated = redeemGiftCardSchema.parse(values);
    
    const giftCard = await giftCardsService.redeemGiftCard(validated.code, user.id!);
    
    revalidatePath("/student/purchases");
    revalidatePath("/leaderboard"); // refresh leaderboard points display
    return giftCard;
  });
}
