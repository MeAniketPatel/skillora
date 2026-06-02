"use server";

import { stripe } from "@/lib/stripe";
import db from "@/lib/prisma";
import { auth } from "@/auth";

export async function createCheckoutSession(courseId: string, couponCode?: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course || course.price === null || course.price <= 0) {
      return { error: "Invalid course or course is free" };
    }

    let finalPrice = course.price;
    let couponRecord = null;

    if (couponCode) {
      couponRecord = await db.coupon.findUnique({
        where: { code: couponCode },
      });

      if (!couponRecord) {
        return { error: "Invalid coupon code" };
      }

      if (couponRecord.expiresAt && new Date(couponRecord.expiresAt) < new Date()) {
        return { error: "Coupon code has expired" };
      }

      if (couponRecord.maxUses && couponRecord.usedCount >= couponRecord.maxUses) {
        return { error: "Coupon code has reached maximum usage limit" };
      }

      if (couponRecord.courseId && couponRecord.courseId !== courseId) {
        return { error: "Coupon code is not applicable to this course" };
      }

      if (couponRecord.type === "PERCENTAGE") {
        finalPrice = course.price * (1 - couponRecord.discount / 100);
      } else {
        finalPrice = Math.max(0, course.price - couponRecord.discount);
      }
    }

    const existingEnrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return { error: "Already enrolled in this course" };
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
        userId: session.user.id,
        courseId: course.id,
        couponId: couponRecord?.id || "",
      },
    });

    return { success: true, url: stripeSession.url };
  } catch (error: any) {
    console.error("[CREATE_CHECKOUT_SESSION]", error);
    return { error: error.message || "Something went wrong" };
  }
}
