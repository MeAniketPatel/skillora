import db from "@/shared/lib/prisma";
import type { EmailPreferenceInput } from "@/features/email-preferences/contracts/email-preference.contract";

export async function getEmailPreferences(userId: string) {
  let prefs = await db.emailPreference.findUnique({
    where: { userId },
  });

  if (!prefs) {
    prefs = await db.emailPreference.create({
      data: {
        userId,
        digestType: "WEEKLY",
        enrollment: true,
        certificates: true,
        promotions: true,
        forumReplies: true,
      },
    });
  }

  return prefs;
}

export async function updateEmailPreferences(userId: string, data: EmailPreferenceInput) {
  return db.emailPreference.upsert({
    where: { userId },
    update: data,
    create: {
      userId,
      ...data,
    },
  });
}
