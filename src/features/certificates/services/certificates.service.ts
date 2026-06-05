// Auto-generated service wrapper for the certificates feature.
// Delegates to the repositories by default (DI via default-param pattern
// per ADR-007). Mutation methods emit domain events on the in-process
// event bus for cross-feature side effects.
import { eventBus } from "@/shared/events";
import * as certificateRepo from "../repositories/certificate.repository";

export const certificatesService = {
  getCertificateById: certificateRepo.getCertificateById,
  getUserCertificates: certificateRepo.getUserCertificates,
  async createCertificate(...args: Parameters<typeof certificateRepo.createCertificate>): Promise<Awaited<ReturnType<typeof certificateRepo.createCertificate>>> {
    const result = await certificateRepo.createCertificate(...args);
    await eventBus.emit({ name: "certificates.createCertificate", feature: "certificates", payload: { result, args }, occurredAt: new Date() } as any);
    return result;
  },
  getCertificateByEnrollment: certificateRepo.getCertificateByEnrollment,
  getUserCertificatesCount: certificateRepo.getUserCertificatesCount,
};

export type CertificatesService = typeof certificatesService;
