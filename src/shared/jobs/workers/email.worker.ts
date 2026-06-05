import type { EmailJobPayload } from "../queues/email.queue";

export const emailWorker = {
  name: "email-worker",
  async process(payload: EmailJobPayload): Promise<void> {
    console.info(`[email-worker] processing -> ${payload.to} | ${payload.subject}`);
  },
};
