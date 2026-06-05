import type { CoursePublishedEvent, PaymentSucceededEvent, CertificateIssuedEvent } from "@/shared/events/types";

export type { CoursePublishedEvent, PaymentSucceededEvent, CertificateIssuedEvent };

export interface EventEnvelope<TType extends string = string, TPayload = unknown> {
  type: TType;
  occurredAt: string;
  payload: TPayload;
}
