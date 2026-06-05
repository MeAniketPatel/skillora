import { z } from "zod";

export const purchaseGiftCardSchema = z.object({
  amount: z.coerce.number().min(5).max(1000),
});

export const redeemGiftCardSchema = z.object({
  code: z.string().length(12, "Gift card code must be exactly 12 characters."),
});
