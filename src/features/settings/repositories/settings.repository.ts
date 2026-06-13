import db from "@/shared/lib/prisma";

export async function getSetting(key: string) {
  return db.platformSetting.findUnique({
    where: { key },
  });
}

export async function setSetting(key: string, value: string) {
  return db.platformSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

export async function getAllSettings() {
  const settings = await db.platformSetting.findMany();
  return settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);
}

export async function updateUserPrivacySettings(userId: string, data: { profileVisible: boolean; activityVisible: boolean; messagingPreference: string }) {
  return db.user.update({
    where: { id: userId },
    data: {
      profileVisible: data.profileVisible,
      activityVisible: data.activityVisible,
      messagingPreference: data.messagingPreference,
    },
  });
}

export async function updateUserNotificationSettings(userId: string, data: { digestType: string; enrollment: boolean; certificates: boolean; promotions: boolean }) {
  return db.emailPreference.upsert({
    where: { userId },
    update: {
      digestType: data.digestType,
      enrollment: data.enrollment,
      certificates: data.certificates,
      promotions: data.promotions,
    },
    create: {
      userId,
      digestType: data.digestType,
      enrollment: data.enrollment,
      certificates: data.certificates,
      promotions: data.promotions,
    },
  });
}
