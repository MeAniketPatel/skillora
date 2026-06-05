export interface EmailJobPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface Job<TPayload = unknown> {
  name: string;
  payload: TPayload;
}

export const emailQueue = {
  name: "email",
  async enqueue(payload: EmailJobPayload): Promise<void> {
    console.info(`[email-queue] enqueued -> ${payload.to} | ${payload.subject}`);
  },
};
