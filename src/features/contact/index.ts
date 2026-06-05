// Auto-generated barrel: re-exports all repositories for the contact feature.

// Components
export { default as ContactForm } from "./components/contact-form";

// Permissions
export { canContact as canContact, assertContactAccess } from "./permissions/contact.permissions";

// Contracts
export { createContactSchema, updateContactSchema, listContactQuerySchema } from "./contracts/contact.contract";
export type { CreateContactInput, UpdateContactInput, ListContactQuery } from "./contracts/contact.contract";

// Hooks
export {  useContactList, useContactDetail, useContactCreate, useContactUpdate, useContactDelete } from "./hooks/use-contact";

