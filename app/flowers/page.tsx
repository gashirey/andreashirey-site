import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { CTA } from "@/components/CTA";
import { AvailabilityCard } from "@/components/AvailabilityCard";
import { AvailabilityNote } from "@/components/AvailabilityNote";
import { OrderingSteps } from "@/components/OrderingSteps";
import { currentAvailability, site } from "@/lib/content";
import { getRootedFarmersHref, links } from "@/lib/links";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Flowers & Availability",
  description: `See what's in bloom at ${site.name} — seasonal bouquets, stems, and specialty blooms.`,
  path: "/flowers",
});

export default function FlowersPage() {
  const rootedHref = getRootedFarmersHref();
  const hasRootedLink = Boolean(links.rootedFarmers);

  return (
    <>
      <Hero
        compact
        title="Flowers & availability"
        subtitle="Seasonal blooms, gathered fresh from our fields"
        imageSrc="/images/placeholders/flowers-hero.svg"
        imageAlt="Placeholder — replace with field rows or bucket of fresh flowers"
        primaryCta={{
          label: "View Current Availability",
          href: rootedHref,
        }}
        secondaryCta={{
          label: "Inquire About Flowers",
          href: "/contact?subject=flowers",
        }}
      />

      <Section
        title="What's available now"
        description="Our offerings change with the seasons. Below is what we're growing and listing this week."
      >
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <AvailabilityNote />
        </div>

        <div className="mb-8 rounded-lg border border-sage/20 bg-sage/5 px-6 py-4 text-sm text-bark">
          {hasRootedLink ? (
            <p>
              Order online through our{" "}
              <a
                href={links.rootedFarmers}
                className="font-medium text-sage-dark underline underline-offset-2"
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
                className="font-medium text-sage-dark underline underline-offset-2"
              >
                inquire about availability
              </a>
              .
            </p>
          )}
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {currentAvailability.map((item) => (
            <AvailabilityCard key={item.id} item={item} />
          ))}
        </div>
      </Section>

      <Section variant="white" title="How ordering works" eyebrow="Simple steps">
        <OrderingSteps />
      </Section>

      <Section variant="parchment">
        <CTA
          title="See the full shop listing"
          description="When Rooted Farmers is connected, this button will take visitors directly to your live inventory."
          primary={{
            label: "View Current Availability",
            href: rootedHref,
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
