import type Stripe from "stripe";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServiceClient } from "@/lib/supabase/server";

export function orderIdFromCheckoutSession(
  session: Stripe.Checkout.Session,
): string | null {
  return (
    (typeof session.metadata?.order_id === "string"
      ? session.metadata.order_id
      : null) ||
    (typeof session.client_reference_id === "string"
      ? session.client_reference_id
      : null)
  );
}

export async function markClientGalleryOrderPaid(
  session: Stripe.Checkout.Session,
): Promise<{ ok: boolean; error?: string }> {
  const orderId = orderIdFromCheckoutSession(session);
  if (!orderId || !isSupabaseConfigured()) {
    return { ok: false };
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("client_gallery_orders")
    .update({
      status: "paid",
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: paymentIntentId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) {
    console.error("[markClientGalleryOrderPaid]", error);
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
