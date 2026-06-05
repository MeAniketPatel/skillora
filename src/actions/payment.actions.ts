"use server";

import { stripe } from "@/shared/lib/stripe";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { NotFoundError, ValidationError, ConflictError } from "@/shared/lib/errors";
import { getCourseById } from "@/features/courses";
import { getCouponByCode } from "@/features/admin";
import { getEnrollment } from "@/features/enrollment";

export async function createCheckoutSession(courseId: string, couponCode?: string) {
  return actionHandler(async () => {
    const user = await requireAuth();

    const course = await getCourseById(courseId);
    if (!course || course.price === null || course.price <= 0) {
      throw new ValidationError("Invalid course or course is free");
    }

    let finalPrice = course.price;
    let couponRecord = null;

    if (couponCode) {
      couponRecord = await getCouponByCode(couponCode);

      if (!couponRecord) throw new ValidationError("Invalid coupon code");
      if (couponRecord.expiresAt && new Date(couponRecord.expiresAt) < new Date()) {
        throw new ValidationError("Coupon code has expired");
      }
      if (couponRecord.maxUses && couponRecord.usedCount >= couponRecord.maxUses) {
        throw new ValidationError("Coupon code has reached maximum usage limit");
      }
      if (couponRecord.courseId && couponRecord.courseId !== courseId) {
        throw new ValidationError("Coupon code is not applicable to this course");
      }

      if (couponRecord.type === "PERCENTAGE") {
        finalPrice = course.price * (1 - couponRecord.discount / 100);
      } else {
        finalPrice = Math.max(0, course.price - couponRecord.discount);
      }
    }

    const existingEnrollment = await getEnrollment(user.id, courseId);
    if (existingEnrollment) {
      throw new ConflictError("Already enrolled in this course");
    }

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: course.currency.toLowerCase(),
            product_data: {
              name: course.title,
              description: course.shortDescription || undefined,
            },
            unit_amount: Math.round(finalPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/learn/${course.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}`,
      metadata: {
        userId: user.id,
        courseId: course.id,
        couponId: couponRecord?.id || "",
      },
    });

    return { url: stripeSession.url };
  });
}
