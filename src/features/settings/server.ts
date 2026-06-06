// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.
// Client components (forms, hooks) must be imported from "@/features/settings".

// Repository functions
export { getSetting, setSetting, getAllSettings } from "./repositories/settings.repository";

// Actions
export { updateSetting } from "./actions/settings.actions";

// Service
import { settingsService as service } from "./services/settings.service";
export { service };

// Platform settings helpers (typed, with safe defaults)
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

// Permissions
export { canSettings, assertSettingsAccess } from "./permissions/settings.permissions";

// Contracts (schemas + types — safe in both contexts)
export { settingSchema } from "./contracts/settings.contract";
export type { SettingInput } from "./contracts/settings.contract";
