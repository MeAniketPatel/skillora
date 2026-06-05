"use server";

import { z } from "zod";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireTeacher } from "@/shared/lib/auth-helpers";
import { liveSessionSchema } from "@/features/live-sessions/contracts/live-session.contract";;
import { createLiveSession, deleteLiveSession, getLiveSessionById, getCourseByIdForOwner } from "@/features/courses/server";
import { triggerWebhook } from "@/lib/webhook-sender";
import { revalidatePath } from "next/cache";
import db from "@/shared/lib/prisma";

export async function createLiveSessionAction(values: z.infer<typeof liveSessionSchema>) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    const validated = liveSessionSchema.parse(values);

    // If associated with a course, verify ownership
    if (validated.courseId) {
      await getCourseByIdForOwner(validated.courseId, user.id);
    }

    const session = await createLiveSession({
      title: validated.title,
      description: validated.description,
      meetUrl: validated.meetUrl,
      startTime: validated.startTime,
      endTime: validated.endTime,
      courseId: validated.courseId,
      hostId: user.id,
    });

    // Send webhook event
    try {
      await triggerWebhook("live-session.created", {
        sessionId: session.id,
        title: session.title,
        meetUrl: session.meetUrl,
        startTime: session.startTime,
        endTime: session.endTime,
        courseId: session.courseId,
        hostId: session.hostId,
      });
    } catch (whErr) {
      console.error("Failed to trigger live-session webhook:", whErr);
    }

    if (validated.courseId) {
      revalidatePath(`/teacher/courses/${validated.courseId}`);
      revalidatePath(`/learn/${validated.courseId}`);
    }
    revalidatePath("/teacher/courses");

    return session;
  });
}

export async function deleteLiveSessionAction(id: string) {
  return actionHandler(async () => {
    const user = await requireTeacher();
    const session = await getLiveSessionById(id);
    if (!session) {
      throw new Error("Live session not found.");
    }

    // Must be host or admin
    if (session.hostId !== user.id && user.role !== "ADMIN") {
      throw new Error("You do not have permission to delete this session.");
    }

    const deleted = await deleteLiveSession(id);

    if (session.courseId) {
      revalidatePath(`/teacher/courses/${session.courseId}`);
      revalidatePath(`/learn/${session.courseId}`);
    }
    revalidatePath("/teacher/courses");

    return deleted;
  });
}
