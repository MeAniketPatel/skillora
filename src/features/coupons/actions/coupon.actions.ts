"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireTeacher } from "@/shared/lib/auth-helpers";
import { couponCreateSchema } from "@/features/admin";
import { service as adminService } from "@/features/admin";
import { assertAdminAccess } from "@/features/admin";
export async function createCoupon(values: any) {
  return actionHandler(async () => {
    await requireTeacher(); // Teachers can create coupons, or admins
    const validated = couponCreateSchema.parse(values);
    
    const coupon = await adminService.createCoupon(validated);
    revalidatePath(`/admin/coupons`);
    revalidatePath(`/teacher/coupons`);
    return coupon;
  });
}

export async function updateCoupon(id: string, values: any) {
  return actionHandler(async () => {
    await requireTeacher();
    // In a real app we'd have a specific schema or allow partial updates
    const coupon = await adminService.updateCoupon(id, values);
    revalidatePath(`/admin/coupons`);
    revalidatePath(`/teacher/coupons`);
    return coupon;
  });
}

export async function deleteCoupon(id: string) {
  return actionHandler(async () => {
    await requireTeacher();
    await adminService.deleteCoupon(id);
    revalidatePath(`/admin/coupons`);
    revalidatePath(`/teacher/coupons`);
    return true;
  });
}
