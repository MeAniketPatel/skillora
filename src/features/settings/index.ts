export { NotificationSettings } from "./components/notification-settings";
export { PrivacySettings } from "./components/privacy-settings";
export { default as SettingsForm } from "./components/settings-form";
export { default as SettingsClientForm } from "./components/settings-form";

export { canSettings, assertSettingsAccess } from "./permissions/settings.permissions";

export { settingSchema } from "./contracts/settings.contract";
export type { SettingInput } from "./contracts/settings.contract";

export { useSettings } from "./hooks/use-settings";

export { updateSetting, updateUserPrivacySettings, updateUserNotificationSettings } from "./actions/settings.actions";
