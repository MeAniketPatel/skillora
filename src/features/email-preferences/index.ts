// Auto-generated barrel: re-exports all repositories for the email-preferences feature.

// Permissions
export { canEmailPreferences as canEmailPreferences, assertEmailPreferencesAccess } from "./permissions/email-preferences.permissions";




// Contracts
export { emailPreferenceSchema } from "./contracts/email-preference.contract";
export type { EmailPreferenceInput } from "./contracts/email-preference.contract";
export { createEmailPreferencesSchema, updateEmailPreferencesSchema, listEmailPreferencesQuerySchema } from "./contracts/email-preferences.contract";
export type { CreateEmailPreferencesInput, UpdateEmailPreferencesInput } from "./contracts/email-preferences.contract";



export { updateEmailPreferencesAction } from "./actions/email-preference.actions";
