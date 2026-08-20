import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { markClientGalleryOrderPaid } from "@/lib/client-gallery/mark-order-paid";
import { getStripe } from "@/lib/stripe/client";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { error: "Webhook is not configured." },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    console.error("[stripe webhook] signature", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded"
  ) {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (
    session.payment_status !== "paid" &&
    event.type === "checkout.session.completed"
  ) {
    if (session.payment_status !== "no_payment_required") {
      return NextResponse.json({ received: true });
    }
  }

  const result = await markClientGalleryOrderPaid(session);
  if (!result.ok && result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
