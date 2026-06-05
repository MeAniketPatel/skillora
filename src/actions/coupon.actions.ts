"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireTeacher } from "@/shared/lib/auth-helpers";
import { couponCreateSchema } from "@/features/admin/contracts/admin.contract";
import { createCoupon as createCouponData, updateCoupon as updateCouponData, deleteCoupon as deleteCouponData } from "@/features/admin/server";
export async function createCoupon(values: any) {
  return actionHandler(async () => {
    await requireTeacher(); // Teachers can create coupons, or admins
    const validated = couponCreateSchema.parse(values);
    
    const coupon = await createCouponData(validated);
    revalidatePath(`/admin/coupons`);
    revalidatePath(`/teacher/coupons`);
    return coupon;
  });
}

export async function updateCoupon(id: string, values: any) {
  return actionHandler(async () => {
    await requireTeacher();
    // In a real app we'd have a specific schema or allow partial updates
    const coupon = await updateCouponData(id, values);
    revalidatePath(`/admin/coupons`);
    revalidatePath(`/teacher/coupons`);
    return coupon;
  });
}

export async function deleteCoupon(id: string) {
  return actionHandler(async () => {
    await requireTeacher();
    await deleteCouponData(id);
    revalidatePath(`/admin/coupons`);
    revalidatePath(`/teacher/coupons`);
    return true;
  });
}
