"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireTeacher } from "@/shared/lib/auth-helpers";
import { ValidationError } from "@/shared/lib/errors";
import { payoutSchema } from "@/features/payouts/contracts/payout.contract";
import { service as teachersService } from "@/features/teachers/server";
import { z } from "zod";

import { assertTeachersAccess } from "@/features/teachers/permissions/teachers.permissions";
export async function requestPayoutAction(values: z.infer<typeof payoutSchema>) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    const validated = payoutSchema.parse(values);

    // Get current balance status
    const { availableBalance } = await teachersService.getPayoutBalance(user.id);

    if (validated.amount > availableBalance) {
      throw new ValidationError(
        `Insufficient balance. You requested $${validated.amount.toFixed(
          2
        )} but only have $${availableBalance.toFixed(2)} available.`
      );
    }

    const payout = await teachersService.createPayoutRequest(user.id, validated.amount);

    revalidatePath("/teacher/payouts");
    return payout;
  });
}
