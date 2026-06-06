// Public barrel for the settings feature. Safe to import from client and server.

// Components
export { NotificationSettings } from "./components/notification-settings";
export { PrivacySettings } from "./components/privacy-settings";
export { default as SettingsForm } from "./components/settings-form";
export { default as SettingsClientForm } from "./components/settings-form";

// Permissions
export { canSettings, assertSettingsAccess } from "./permissions/settings.permissions";

// Contracts
export { settingSchema } from "./contracts/settings.contract";
export type { SettingInput } from "./contracts/settings.contract";

// Hooks
export { useSettings } from "./hooks/use-settings";

export { updateSetting } from "./actions/settings.actions";
