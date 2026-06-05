// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.

// Repository functions
export { getCertificateById, getUserCertificates, createCertificate, getCertificateByEnrollment, getUserCertificatesCount } from "./repositories/certificate.repository";
