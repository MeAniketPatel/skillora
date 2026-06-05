import crypto from "crypto";
import { getActiveWebhooksByEvent, logWebhookDelivery } from "@/features/webhooks";

export async function triggerWebhook(event: string, payload: any) {
  try {
    const webhooks = await getActiveWebhooksByEvent(event);
    if (webhooks.length === 0) return;

    const jsonPayload = JSON.stringify({
      event,
      timestamp: new Date().toISOString(),
      data: payload,
    });

    const deliveryPromises = webhooks.map(async (webhook) => {
      // Calculate HMAC SHA256 signature
      const signature = crypto
        .createHmac("sha256", webhook.secret)
        .update(jsonPayload)
        .digest("hex");

      let statusCode: number | null = null;
      let responseText: string | null = null;
      let success = false;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const response = await fetch(webhook.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Skillora-Signature": signature,
            "X-Skillora-Event": event,
          },
          body: jsonPayload,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        statusCode = response.status;
        responseText = await response.text();
        success = response.ok;
      } catch (err: any) {
        responseText = err.message || "Request timed out or connection failed";
      }

      await logWebhookDelivery({
        webhookId: webhook.id,
        statusCode,
        payload: jsonPayload,
        response: responseText?.slice(0, 1000) || null,
        success,
      });
    });

    // Fire in the background, don't await response to block main thread
    Promise.allSettled(deliveryPromises).catch((err) => {
      console.error("[WEBHOOK_DISPATCH_FAILED]", err);
    });
  } catch (error) {
    console.error("[WEBHOOK_TRIGGER_ERROR]", error);
  }
}
