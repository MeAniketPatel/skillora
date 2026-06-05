export interface DomainEvent {
  type: string;
  occurredAt: string;
  payload: Record<string, unknown>;
}

export interface CoursePublishedEvent extends DomainEvent {
  type: "course.published";
  payload: { courseId: string; teacherId: string; title: string };
}

export interface PaymentSucceededEvent extends DomainEvent {
  type: "payment.succeeded";
  payload: { paymentId: string; userId: string; courseId?: string; amount: number };
}

export interface CertificateIssuedEvent extends DomainEvent {
  type: "certificate.issued";
  payload: { certificateId: string; userId: string; courseId: string };
}

export type AppDomainEvent = CoursePublishedEvent | PaymentSucceededEvent | CertificateIssuedEvent;
