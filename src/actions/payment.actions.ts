"use server";

import { stripe } from "@/lib/stripe";
import db from "@/lib/prisma";
import { auth } from "@/auth";

export async function createCheckoutSession(courseId: string) {
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
            unit_amount: Math.round(course.price * 100),
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
      },
    });

    return { success: true, url: stripeSession.url };
  } catch (error: any) {
    console.error("[CREATE_CHECKOUT_SESSION]", error);
    return { error: error.message || "Something went wrong" };
  }
}
