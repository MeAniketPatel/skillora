"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAdmin, requireAuth } from "@/shared/lib/auth-helpers";
import { createBundleSchema } from "@/validations/bundle.schema";
import { createCourseBundle, getCourseBundleDetail } from "@/data";
import db from "@/shared/lib/prisma"; // Direct db import allowed for multi-step transaction if needed, but we can do it via loop / DAL

export async function createBundleAction(values: z.infer<typeof createBundleSchema>) {
  return actionHandler(async () => {
    await requireAdmin();
    const validated = createBundleSchema.parse(values);

    const bundle = await createCourseBundle(
      validated.title,
      validated.description,
      validated.price,
      validated.courseIds
    );

    revalidatePath("/admin/learning-paths"); // or wherever bundles are managed
    return bundle;
  });
}

export async function purchaseBundleAction(bundleId: string) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const bundle = await getCourseBundleDetail(bundleId);

    if (!bundle) {
      throw new Error("Course bundle not found.");
    }

    const enrolledCourses: string[] = [];

    // Process enrollments & purchases in a simple loop
    for (const bundleCourse of bundle.courses) {
      const courseId = bundleCourse.courseId;
      
      // Check existing enrollment
      const existing = await db.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id!,
            courseId,
          },
        },
      });

      if (!existing) {
        // Create enrollment
        const enrollment = await db.enrollment.create({
          data: {
            userId: user.id!,
            courseId,
          },
        });

        // Log purchase
        await db.purchase.create({
          data: {
            userId: user.id!,
            enrollmentId: enrollment.id,
            amount: 0, // In mock, individual courses in a bundle are log-purchased at 0, bundle-wide value is simulated
            status: "COMPLETED",
          },
        });

        enrolledCourses.push(bundleCourse.course.title);
      }
    }

    revalidatePath("/student/courses");
    return {
      message: `Successfully enrolled in ${enrolledCourses.length} new courses from the bundle!`,
      enrolledCourses,
    };
  });
}
