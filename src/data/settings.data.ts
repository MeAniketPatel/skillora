import db from "@/lib/prisma";

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
