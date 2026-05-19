import type { Metadata } from "next";
import { Suspense } from "react";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { CTA } from "@/components/CTA";
import { AvailabilityNote } from "@/components/AvailabilityNote";
import { OrderingSteps } from "@/components/OrderingSteps";
import { AvailableNowSection } from "@/components/inventory/AvailableNowSection";
import { site } from "@/lib/content";
import { getRootedFarmersHref, links } from "@/lib/links";
import { isInventoryConfigured } from "@/lib/inventory/queries";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Flowers & Availability",
  description: `See what's in bloom at ${site.name} — seasonal bouquets, stems, and specialty blooms.`,
  path: "/flowers",
});

export default function FlowersPage() {
  const rootedHref = getRootedFarmersHref();
  const hasRootedLink = Boolean(links.rootedFarmers);
  const liveInventory = isInventoryConfigured();

  return (
    <>
      <Hero
        compact
        title="Flowers & availability"
        subtitle="Seasonal blooms, gathered fresh from our fields"
        imageSrc="/images/placeholders/flowers-hero.svg"
        imageAlt="Placeholder — replace with field rows or bucket of fresh flowers"
        primaryCta={{
          label: liveInventory ? "Available now" : "View Current Availability",
          href: liveInventory ? "/available-now" : rootedHref,
        }}
        secondaryCta={{
          label: "Inquire About Flowers",
          href: "/contact?subject=flowers",
        }}
      />

      <Section
        title="What's available now"
        description="Our offerings change with the seasons. Below is what we're listing today."
      >
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <AvailabilityNote />
        </div>

        <div className="mb-8 border border-parchment bg-cream px-5 py-4 text-sm text-bark">
          {hasRootedLink ? (
            <p>
              Order online through our{" "}
              <a
                href={links.rootedFarmers}
                className="font-medium text-salmon-dark underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Rooted Farmers shop
              </a>
              .
            </p>
          ) : (
            <p>
              Online ordering via Rooted Farmers is coming soon. For now, please{" "}
              <a
                href="/contact?subject=flowers"
                className="font-medium text-salmon-dark underline underline-offset-2"
              >
                inquire about availability
              </a>
              .
            </p>
          )}
        </div>

        <Suspense
          fallback={
            <div className="grid gap-8 sm:grid-cols-2">
              {[1, 2].map((n) => (
                <div key={n} className="card h-80 bg-parchment" aria-hidden />
              ))}
            </div>
          }
        >
          <AvailableNowSection showHeading={false} />
        </Suspense>
      </Section>

      <Section variant="white" title="How ordering works" eyebrow="Simple steps">
        <OrderingSteps />
      </Section>

      <Section variant="parchment">
        <CTA
          title="See the full shop listing"
          description="When Rooted Farmers is connected, this button will take visitors directly to your live inventory."
          primary={{
            label: liveInventory ? "Available now" : "View Current Availability",
            href: liveInventory ? "/available-now" : rootedHref,
          }}
          secondary={{
            label: "Inquire About Flowers",
            href: "/contact?subject=flowers",
          }}
        />
      </Section>
    </>
  );
}
