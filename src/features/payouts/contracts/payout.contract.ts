import { z } from "zod";


export const payoutSchema = z.object({
  amount: z.coerce
    .number()
    .min(10, "Minimum payout request is $10.00")
    .max(100000, "Maximum single payout request is $100,000.00"),
});
