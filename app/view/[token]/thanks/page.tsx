import Link from "next/link";
import { site } from "@/lib/content";
import { markClientGalleryOrderPaid } from "@/lib/client-gallery/mark-order-paid";
import { getStripe, getStripeSecretKey } from "@/lib/stripe/client";

type PageProps = {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ session_id?: string }>;
};

export const dynamic = "force-dynamic";

export default async function OrderThanksPage({ params, searchParams }: PageProps) {
  const { token } = await params;
  const { session_id: sessionId } = await searchParams;

  let paid = false;
  if (sessionId && getStripeSecretKey()) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      paid =
        session.payment_status === "paid" ||
        session.payment_status === "no_payment_required";
      if (paid) {
        await markClientGalleryOrderPaid(session);
      }
    } catch {
      paid = false;
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-6 py-16">
      <p className="text-xs uppercase tracking-[0.14em] text-stone">
        {site.brand}
      </p>
      <h1 className="type-page-title mt-4 text-bark">
        {paid ? "Payment received" : "Thank you"}
      </h1>
      <p className="type-page-body mt-4 text-stone leading-relaxed">
        {paid
          ? "Your digital file order is confirmed. Andrea will follow up by email with your files."
          : "If you completed payment, Andrea will follow up by email. If checkout was interrupted, you can return to the gallery and try again."}
      </p>
      <p className="mt-8">
        <Link
          href={`/view/${token}`}
          className="btn inline-flex border-bark bg-bark text-cream"
        >
          Back to gallery
        </Link>
      </p>
    </div>
  );
}
