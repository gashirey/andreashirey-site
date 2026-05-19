import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { AvailableNowCard } from "@/components/inventory/AvailableNowCard";
import { formatDisplayDate } from "@/lib/inventory/date";
import { getAvailableNow, isInventoryConfigured } from "@/lib/inventory/queries";
import { site } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Availability",
  description: `Current stems and bunches from ${site.name}, Louisa Virginia.`,
  path: "/available-now",
});

export default async function AvailableNowPage() {
  const configured = isInventoryConfigured();
  const { date, items } = configured
    ? await getAvailableNow()
    : { date: "", items: [] };

  return (
    <Section className="pt-24 md:pt-32">
      <header className="mb-14 max-w-xl border-b border-parchment pb-10">
        <h1 className="font-serif text-4xl font-medium leading-tight text-bark md:text-5xl">
          Available now
        </h1>
        {configured && items.length > 0 && (
          <p className="mt-3 text-sm text-stone">{formatDisplayDate(date)}</p>
        )}
        <p className="mt-3 text-sm text-stone">Limited weekly harvests.</p>
      </header>

      {!configured ? (
        <p className="text-sm text-stone">
          <Link href="/contact?subject=flowers" className="underline">
            Contact us
          </Link>{" "}
          for this week&apos;s list.
        </p>
      ) : items.length === 0 ? (
        <p className="text-sm text-stone">
          Nothing listed today.{" "}
          <Link href="/contact?subject=flowers" className="underline">
            Ask what&apos;s in bloom
          </Link>
          .
        </p>
      ) : (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <AvailableNowCard key={item.availabilityId} item={item} />
          ))}
        </div>
      )}
    </Section>
  );
}
