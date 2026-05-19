import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { AvailableNowCard } from "@/components/inventory/AvailableNowCard";
import { formatDisplayDate } from "@/lib/inventory/date";
import { getAvailableNow, isInventoryConfigured } from "@/lib/inventory/queries";
import { site } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Available Now",
  description: `See what ${site.name} has fresh today — bunches, pricing, and quantity updated from the field.`,
  path: "/available-now",
});

export default async function AvailableNowPage() {
  const configured = isInventoryConfigured();
  const { date, items } = configured
    ? await getAvailableNow()
    : { date: "", items: [] };

  return (
    <>
      <Hero
        compact
        title="Available now"
        subtitle="Fresh from the field — updated daily"
        imageSrc="/images/bb.jpg"
        imageAlt="Fresh flowers from Grey Gables Farm"
        primaryCta={{
          label: "Inquire to order",
          href: "/contact?subject=flowers",
        }}
        secondaryCta={{
          label: "All flowers",
          href: "/flowers",
        }}
      />

      <Section
        title="Today's offerings"
        description={
          configured
            ? formatDisplayDate(date)
            : "Live inventory is being connected."
        }
      >
        {!configured ? (
          <p className="text-sm text-stone">
            Check the{" "}
            <Link href="/flowers" className="text-salmon-dark underline">
              flowers page
            </Link>{" "}
            or{" "}
            <Link href="/contact?subject=flowers" className="text-salmon-dark underline">
              contact us
            </Link>{" "}
            for availability.
          </p>
        ) : items.length === 0 ? (
          <div className="border border-parchment bg-site-surface px-5 py-10 text-center">
            <p className="text-stone">Nothing listed for today yet.</p>
            <p className="mt-4 text-sm">
              <Link
                href="/contact?subject=flowers"
                className="text-salmon-dark underline underline-offset-2"
              >
                Send an inquiry
              </Link>{" "}
              and we&apos;ll let you know what&apos;s in bloom.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <AvailableNowCard key={item.availabilityId} item={item} />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
