// Auto-generated service wrapper for the payments feature.
// Delegates to the repositories by default (DI via default-param pattern
// per ADR-007). Mutation methods emit domain events on the in-process
// event bus for cross-feature side effects.
import { eventBus } from "@/shared/events";
import db from "@/shared/lib/prisma";
import * as paymentRepo from "../repositories/payment.repository";

export const paymentsService = {
  async createPurchase(...args: Parameters<typeof paymentRepo.createPurchase>): Promise<Awaited<ReturnType<typeof paymentRepo.createPurchase>>> {
    const result = await paymentRepo.createPurchase(...args);
    await eventBus.emit({ name: "payments.createPurchase", feature: "payments", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  getPurchaseByStripeId: paymentRepo.getPurchaseByStripeId,
  getUserPurchases: paymentRepo.getUserPurchases,
  getTeacherEarnings: paymentRepo.getTeacherEarnings,
  getPlatformRevenue: paymentRepo.getPlatformRevenue,
  getRevenueTimeSeries: paymentRepo.getRevenueTimeSeries,
  getRecentPurchases: paymentRepo.getRecentPurchases,
  getRevenueByTeacher: paymentRepo.getRevenueByTeacher,
  getRevenueByCourse: paymentRepo.getRevenueByCourse,

  async handleCheckoutCompleted(session: any): Promise<void> {
    const userId = session?.metadata?.userId;
    const courseId = session?.metadata?.courseId;

    if (!userId || !courseId) {
      throw new Error("Missing metadata");
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
      throw new Error("User not found");
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

      const lessons = course?.sections.flatMap((s) => s.lessons) || [];
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
          message: `Thank you! You have successfully purchased and enrolled in "${course?.title || ""}".`,
          link: `/learn/${courseId}/${lessons[0]?.id || ""}`,
        },
      });
    });

    // Send purchase email
    try {
      const { sendPurchaseConfirmation } = await import("@/shared/lib/mail");
      await sendPurchaseConfirmation(
        user.email,
        user.name || user.email,
        course?.title || "",
        session.amount_total ? session.amount_total / 100 : 0
      );
    } catch (err) {
      console.error("Failed to send purchase email:", err);
    }
  }
};

export type PaymentsService = typeof paymentsService;
