export { getSetting, setSetting, getAllSettings } from "./repositories/settings.repository";

export { updateSetting } from "./actions/settings.actions";

import { settingsService as service } from "./services/settings.service";
export { service };

export {
  getPlatformSetting,
  getPlatformFeePercentage,
} from "./services/platform-settings.service";
export {
  PLATFORM_SETTINGS_KEYS,
  PLATFORM_SETTINGS_DEFAULTS,
  DEFAULT_PLATFORM_FEE_PERCENTAGE,
} from "@/shared/constants/platform-settings";
export type { PlatformSettingKey } from "@/shared/constants/platform-settings";

export { canSettings, assertSettingsAccess } from "./permissions/settings.permissions";

export { settingSchema } from "./contracts/settings.contract";
export type { SettingInput } from "./contracts/settings.contract";
