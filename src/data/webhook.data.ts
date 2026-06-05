import db from "@/lib/prisma";

export async function getWebhooks() {
  return db.webhook.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: { logs: true },
      },
    },
  });
}

export async function getWebhookById(id: string) {
  return db.webhook.findUnique({
    where: { id },
    include: {
      logs: {
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
      },
    },
  });
}

export async function getActiveWebhooksByEvent(event: string) {
  return db.webhook.findMany({
    where: {
      event,
      isActive: true,
    },
  });
}

export async function createWebhook(data: {
  url: string;
  event: string;
  secret: string;
}) {
  return db.webhook.create({
    data: {
      url: data.url,
      event: data.event,
      secret: data.secret,
    },
  });
}

export async function deleteWebhook(id: string) {
  return db.webhook.delete({
    where: { id },
  });
}

export async function logWebhookDelivery(data: {
  webhookId: string;
  statusCode?: number | null;
  payload: string;
  response?: string | null;
  success: boolean;
}) {
  return db.webhookLog.create({
    data: {
      webhookId: data.webhookId,
      statusCode: data.statusCode,
      payload: data.payload,
      response: data.response,
      success: data.success,
    },
  });
}
