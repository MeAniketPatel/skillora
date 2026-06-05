"use server";

import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { createCollectionSchema, courseToCollectionSchema } from "@/validations/collection.schema";
import {
  createCollection,
  addCourseToCollection,
  removeCourseFromCollection,
  deleteCollection,
} from "@/data/collection.data";
import { revalidatePath } from "next/cache";

export async function createCollectionAction(values: any) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const validated = createCollectionSchema.parse(values);

    const result = await createCollection(user.id, validated);
    revalidatePath("/student/collections");
    return result;
  });
}

export async function addCourseToCollectionAction(values: { collectionId: string; courseId: string }) {
  return actionHandler(async () => {
    await requireAuth();
    const validated = courseToCollectionSchema.parse(values);

    const result = await addCourseToCollection(validated.collectionId, validated.courseId);
    revalidatePath("/student/collections");
    return result;
  });
}

export async function removeCourseFromCollectionAction(values: { collectionId: string; courseId: string }) {
  return actionHandler(async () => {
    await requireAuth();
    const validated = courseToCollectionSchema.parse(values);

    const result = await removeCourseFromCollection(validated.collectionId, validated.courseId);
    revalidatePath("/student/collections");
    return result;
  });
}

export async function deleteCollectionAction(collectionId: string) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const result = await deleteCollection(collectionId, user.id);
    revalidatePath("/student/collections");
    return result;
  });
}
