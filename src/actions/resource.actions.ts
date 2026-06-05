"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { actionHandler } from "@/lib/action-utils";
import { requireAuth } from "@/lib/auth-helpers";
import { addResourceSchema } from "@/validations/resource.schema";
import { createResource, deleteResource } from "@/data";
import db from "@/lib/prisma";

export async function addCourseResourceAction(courseId: string, values: z.infer<typeof addResourceSchema>) {
  return actionHandler(async () => {
    const user = await requireAuth();
    
    // Check if course belongs to teacher or user is admin
    const course = await db.course.findUnique({
      where: { id: courseId },
      select: { teacherId: true },
    });

    if (!course) {
      throw new Error("Course not found.");
    }

    if (course.teacherId !== user.id && user.role !== "ADMIN") {
      throw new Error("You do not have permission to add resources to this course.");
    }

    const validated = addResourceSchema.parse(values);

    const resource = await createResource(
      courseId,
      validated.name,
      validated.url,
      validated.fileSize,
      validated.fileType
    );

    revalidatePath(`/teacher/courses/${courseId}`);
    return resource;
  });
}

export async function deleteCourseResourceAction(courseId: string, resourceId: string) {
  return actionHandler(async () => {
    const user = await requireAuth();

    const course = await db.course.findUnique({
      where: { id: courseId },
      select: { teacherId: true },
    });

    if (!course) {
      throw new Error("Course not found.");
    }

    if (course.teacherId !== user.id && user.role !== "ADMIN") {
      throw new Error("You do not have permission to delete resources from this course.");
    }

    const resource = await deleteResource(resourceId);

    revalidatePath(`/teacher/courses/${courseId}`);
    return resource;
  });
}
