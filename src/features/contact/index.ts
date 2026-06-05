// Auto-generated barrel: re-exports all repositories for the contact feature.

// Components
export { default as ContactForm } from "./components/contact-form";

// Permissions
export { canContact as canContact, assertContactAccess } from "./permissions/contact.permissions";




// Contracts
export { contactSchema } from "./contracts/contact.contract";
export type { ContactInput } from "./contracts/contact.contract";


export { markContactReplied, submitContactForm } from "./actions/contact.actions";
