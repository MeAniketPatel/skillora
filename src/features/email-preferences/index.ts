// Auto-generated barrel: re-exports all repositories for the email-preferences feature.
export * from "./repositories/email-preference.repository";

// Services
export { emailPreferencesService } from "./services/email-preferences.service";
export type { EmailPreferencesService } from "./services/email-preferences.service";

// Permissions
export { canEmailPreferences as canEmailPreferences, assertEmailPreferencesAccess } from "./permissions/email-preferences.permissions";

// Contracts
export { createEmailPreferencesSchema, updateEmailPreferencesSchema, listEmailPreferencesQuerySchema } from "./contracts/email-preferences.contract";
export type { CreateEmailPreferencesInput, UpdateEmailPreferencesInput, ListEmailPreferencesQuery } from "./contracts/email-preferences.contract";

// Hooks
export {  useEmailPreferencesList, useEmailPreferencesDetail, useEmailPreferencesCreate, useEmailPreferencesUpdate, useEmailPreferencesDelete } from "./hooks/use-email-preferences";

