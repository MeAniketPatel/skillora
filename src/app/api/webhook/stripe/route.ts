import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/shared/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as any;

  if (event.type === "checkout.session.completed") {
    try {
      const paymentsServer = await import("@/features/payments/server");
      await paymentsServer.service.handleCheckoutCompleted(session);
    } catch (error: any) {
      return new NextResponse(`Webhook Error: ${error.message}`, { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}
