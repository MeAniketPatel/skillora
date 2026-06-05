"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { noteCreateSchema, noteUpdateSchema } from "@/features/notes/contracts/note.contract";
import { service as studentsService } from "@/features/students/server";
import { assertStudentsAccess } from "@/features/students/server";
export async function createNote(values: any) {
  return actionHandler(async () => {
    const user = await requireAuth();
    assertStudentsAccess(user.role, "update");
    const validated = noteCreateSchema.parse(values);

    const note = await studentsService.createNote(user.id, validated.lessonId, validated.content, validated.timestamp);
    revalidatePath(`/learn`);
    return note;
  });
}

export async function updateNote(noteId: string, values: any) {
  return actionHandler(async () => {
    const user = await requireAuth();
    assertStudentsAccess(user.role, "update");
    const validated = noteUpdateSchema.parse(values);

    const note = await studentsService.updateNote(noteId, user.id, validated.content);
    revalidatePath(`/learn`);
    return note;
  });
}

export async function deleteNote(noteId: string) {
  return actionHandler(async () => {
    const user = await requireAuth();
    await studentsService.deleteNote(noteId, user.id);
    revalidatePath(`/learn`);
    return true;
  });
}
