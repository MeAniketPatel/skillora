export { getCertificateById, getUserCertificates, createCertificate, getCertificateByEnrollment, getUserCertificatesCount } from "./repositories/certificate.repository";

import { certificatesService as service } from "./services/certificates.service";
export { service };

