import db from "@/shared/lib/prisma";
import {
  PLATFORM_SETTINGS_DEFAULTS,
  PLATFORM_SETTINGS_KEYS,
  type PlatformSettingKey,
} from "@/shared/constants/platform-settings";

export async function getPlatformSetting(key: PlatformSettingKey): Promise<string> {
  const row = await db.platformSetting.findUnique({ where: { key } });
  return row?.value ?? PLATFORM_SETTINGS_DEFAULTS[key];
}

export async function getPlatformFeePercentage(): Promise<number> {
  const raw = await getPlatformSetting(PLATFORM_SETTINGS_KEYS.PLATFORM_FEE_PERCENTAGE);
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) {
    return Number(PLATFORM_SETTINGS_DEFAULTS[PLATFORM_SETTINGS_KEYS.PLATFORM_FEE_PERCENTAGE]);
  }
  return parsed;
}
