// Auto-generated barrel: re-exports all repositories for the certificates feature.
export * from "./repositories/certificate.repository";

// Services
export { certificatesService } from "./services/certificates.service";
export type { CertificatesService } from "./services/certificates.service";

// Permissions
export { canCertificates as canCertificates, assertCertificatesAccess } from "./permissions/certificates.permissions";

// Contracts
export { createCertificatesSchema, updateCertificatesSchema, listCertificatesQuerySchema } from "./contracts/certificates.contract";
export type { CreateCertificatesInput, UpdateCertificatesInput, ListCertificatesQuery } from "./contracts/certificates.contract";

// Hooks
export {  useCertificatesList, useCertificatesDetail, useCertificatesCreate, useCertificatesUpdate, useCertificatesDelete } from "./hooks/use-certificates";

