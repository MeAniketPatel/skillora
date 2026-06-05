// Auto-generated barrel: re-exports all repositories for the settings feature.

// Components
export { NotificationSettings } from "./components/notification-settings";
export { PrivacySettings } from "./components/privacy-settings";
export { default as SettingsForm, default as SettingsClientForm } from "./components/settings-form";

// Permissions
export { canSettings as canSettings, assertSettingsAccess } from "./permissions/settings.permissions";

// Contracts
export { createSettingsSchema, updateSettingsSchema, listSettingsQuerySchema } from "./contracts/settings.contract";
export type { CreateSettingsInput, UpdateSettingsInput, ListSettingsQuery } from "./contracts/settings.contract";

// Hooks
export {  useSettingsList, useSettingsDetail, useSettingsCreate, useSettingsUpdate, useSettingsDelete } from "./hooks/use-settings";

