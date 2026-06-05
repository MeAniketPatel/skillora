// Auto-generated barrel: re-exports all repositories for the certificates feature.

// Permissions
export { canCertificates as canCertificates, assertCertificatesAccess } from "./permissions/certificates.permissions";




// Contracts
export { createCertificatesSchema, updateCertificatesSchema, listCertificatesQuerySchema } from "./contracts/certificates.contract";
export type { CreateCertificatesInput, UpdateCertificatesInput } from "./contracts/certificates.contract";

export { getUserCertificates, getUserCertificatesCount, getCertificateById, service } from "./server";
