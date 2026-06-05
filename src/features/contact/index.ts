// Auto-generated barrel: re-exports all repositories for the contact feature.
export * from "./repositories/contact.repository";

// Components
export { default as ContactForm } from "./components/contact-form";

// Services
export { contactService } from "./services/contact.service";
export type { ContactService } from "./services/contact.service";

// Permissions
export { canContact as canContact, assertContactAccess } from "./permissions/contact.permissions";

// Contracts
export { createContactSchema, updateContactSchema, listContactQuerySchema } from "./contracts/contact.contract";
export type { CreateContactInput, UpdateContactInput, ListContactQuery } from "./contracts/contact.contract";

// Hooks
export {  useContactList, useContactDetail, useContactCreate, useContactUpdate, useContactDelete } from "./hooks/use-contact";

