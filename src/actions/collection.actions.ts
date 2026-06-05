"use server";

import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { createCollectionSchema, courseToCollectionSchema } from "@/features/collections/contracts/collection.contract";
import { service as studentsService } from "@/features/students/server";
import { revalidatePath } from "next/cache";

export async function createCollectionAction(values: any) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const validated = createCollectionSchema.parse(values);

    const result = await studentsService.createCollection(user.id, validated);
    revalidatePath("/student/collections");
    return result;
  });
}

export async function addCourseToCollectionAction(values: { collectionId: string; courseId: string }) {
  return actionHandler(async () => {
    await requireAuth();
    const validated = courseToCollectionSchema.parse(values);

    const result = await studentsService.addCourseToCollection(validated.collectionId, validated.courseId);
    revalidatePath("/student/collections");
    return result;
  });
}

export async function removeCourseFromCollectionAction(values: { collectionId: string; courseId: string }) {
  return actionHandler(async () => {
    await requireAuth();
    const validated = courseToCollectionSchema.parse(values);

    const result = await studentsService.removeCourseFromCollection(validated.collectionId, validated.courseId);
    revalidatePath("/student/collections");
    return result;
  });
}

export async function deleteCollectionAction(collectionId: string) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const result = await studentsService.deleteCollection(collectionId, user.id);
    revalidatePath("/student/collections");
    return result;
  });
}
