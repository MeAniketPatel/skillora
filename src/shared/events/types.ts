export interface DomainEvent<TName extends string = string, TPayload = unknown> {
  name: TName;
  feature: string;
  payload: TPayload;
  occurredAt: Date;
}

export type CoursePublishedEvent = DomainEvent<"course.published", { courseId: string; teacherId: string; title: string }>;

export type PaymentSucceededEvent = DomainEvent<"payment.succeeded", { paymentId: string; userId: string; courseId?: string; amount: number }>;

export type CertificateIssuedEvent = DomainEvent<"certificate.issued", { certificateId: string; userId: string; courseId: string }>;

export type AppDomainEvent = CoursePublishedEvent | PaymentSucceededEvent | CertificateIssuedEvent;
