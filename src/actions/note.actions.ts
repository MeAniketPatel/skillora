"use server";

import { revalidatePath } from "next/cache";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAuth } from "@/shared/lib/auth-helpers";
import { noteCreateSchema, noteUpdateSchema } from "@/validations/note.schema";
import { createNote as createNoteData, updateNote as updateNoteData, deleteNote as deleteNoteData } from "@/features/students/server";
export async function createNote(values: any) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const validated = noteCreateSchema.parse(values);

    const note = await createNoteData(user.id, validated.lessonId, validated.content, validated.timestamp);
    revalidatePath(`/learn`);
    return note;
  });
}

export async function updateNote(noteId: string, values: any) {
  return actionHandler(async () => {
    const user = await requireAuth();
    const validated = noteUpdateSchema.parse(values);

    const note = await updateNoteData(noteId, user.id, validated.content);
    revalidatePath(`/learn`);
    return note;
  });
}

export async function deleteNote(noteId: string) {
  return actionHandler(async () => {
    const user = await requireAuth();
    await deleteNoteData(noteId, user.id);
    revalidatePath(`/learn`);
    return true;
  });
}
