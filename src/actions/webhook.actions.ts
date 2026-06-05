"use server";

import { z } from "zod";
import crypto from "crypto";
import { actionHandler } from "@/shared/lib/action-utils";
import { requireAdmin } from "@/shared/lib/auth-helpers";
import { webhookSchema } from "@/validations";
import { createWebhook, deleteWebhook, getWebhookById, logWebhookDelivery } from "@/data";
import { revalidatePath } from "next/cache";

export async function registerWebhookAction(values: z.infer<typeof webhookSchema>) {
  return actionHandler(async () => {
    await requireAdmin();
    const validated = webhookSchema.parse(values);

    // Generate a secure webhook secret
    const secret = `whsec_${crypto.randomBytes(24).toString("hex")}`;

    const webhook = await createWebhook({
      url: validated.url,
      event: validated.event,
      secret,
    });

    revalidatePath("/admin/settings");
    return webhook;
  });
}

export async function deleteWebhookAction(id: string) {
  return actionHandler(async () => {
    await requireAdmin();
    const deleted = await deleteWebhook(id);
    revalidatePath("/admin/settings");
    return deleted;
  });
}

export async function testWebhookAction(id: string) {
  return actionHandler(async () => {
    await requireAdmin();
    const webhook = await getWebhookById(id);
    if (!webhook) {
      throw new Error("Webhook not found");
    }

    const testPayload = JSON.stringify({
      event: webhook.event,
      timestamp: new Date().toISOString(),
      test: true,
      data: {
        message: "This is a test webhook payload from Skillora command center",
      },
    });

    const signature = crypto
      .createHmac("sha256", webhook.secret)
      .update(testPayload)
      .digest("hex");

    let statusCode: number | null = null;
    let responseText: string | null = null;
    let success = false;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

      const response = await fetch(webhook.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Skillora-Signature": signature,
          "X-Skillora-Event": webhook.event,
          "X-Skillora-Test": "true",
        },
        body: testPayload,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      statusCode = response.status;
      responseText = await response.text();
      success = response.ok;
    } catch (err: any) {
      responseText = err.message || "Connection test failed";
    }

    // Log the test delivery
    await logWebhookDelivery({
      webhookId: webhook.id,
      statusCode,
      payload: testPayload,
      response: responseText?.slice(0, 1000) || null,
      success,
    });

    revalidatePath("/admin/settings");
    return { success, statusCode, response: responseText };
  });
}
