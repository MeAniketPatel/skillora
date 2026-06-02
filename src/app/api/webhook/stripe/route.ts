import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import db from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as any;

  if (event.type === "checkout.session.completed") {
    const userId = session?.metadata?.userId;
    const courseId = session?.metadata?.courseId;

    if (!userId || !courseId) {
      return new NextResponse("Webhook Error: Missing metadata", { status: 400 });
    }

    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        sections: {
          include: {
            lessons: {
              where: { isPublished: true },
            },
          },
        },
      },
    });

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    await db.$transaction(async (tx) => {
      const enrollment = await tx.enrollment.upsert({
        where: {
          userId_courseId: { userId, courseId },
        },
        update: {},
        create: {
          userId,
          courseId,
        },
      });

      const lessons = course.sections.flatMap((s) => s.lessons);
      if (lessons.length > 0) {
        const existingProgress = await tx.lessonProgress.findMany({
          where: { enrollmentId: enrollment.id },
          select: { lessonId: true },
        });
        const existingLessonIds = new Set(existingProgress.map((p) => p.lessonId));
        const newLessons = lessons.filter((l) => !existingLessonIds.has(l.id));

        if (newLessons.length > 0) {
          await tx.lessonProgress.createMany({
            data: newLessons.map((lesson) => ({
              enrollmentId: enrollment.id,
              lessonId: lesson.id,
              isCompleted: false,
            })),
          });
        }
      }

      await tx.purchase.upsert({
        where: { enrollmentId: enrollment.id },
        update: {
          status: "COMPLETED",
          stripePaymentId: session.id,
        },
        create: {
          userId,
          enrollmentId: enrollment.id,
          amount: session.amount_total ? session.amount_total / 100 : 0,
          currency: (session.currency || "usd").toUpperCase(),
          status: "COMPLETED",
          stripePaymentId: session.id,
        },
      });

      if (session.metadata?.couponId) {
        await tx.coupon.update({
          where: { id: session.metadata.couponId },
          data: {
            usedCount: {
              increment: 1,
            },
          },
        });
      }

      // Create in-app notification
      await tx.notification.create({
        data: {
          userId,
          type: "PURCHASE",
          title: "Course Purchased! 💳",
          message: `Thank you! You have successfully purchased and enrolled in "${course.title}".`,
          link: `/learn/${courseId}/${lessons[0]?.id || ""}`,
        },
      });
    });

    // Send purchase email
    try {
      const { sendPurchaseConfirmation } = await import("@/lib/mail");
      await sendPurchaseConfirmation(
        user.email,
        user.name || user.email,
        course.title,
        session.amount_total ? session.amount_total / 100 : 0
      );
    } catch (err) {
      console.error("Failed to send purchase email:", err);
    }
  }

  return new NextResponse(null, { status: 200 });
}
