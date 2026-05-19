import Image from "next/image";
import { HeroSlider } from "@/components/HeroSlider";
import { Section } from "@/components/Section";
import { CTA } from "@/components/CTA";
import { Button } from "@/components/Button";
import { AvailabilityCard } from "@/components/AvailabilityCard";
import { AvailabilityNote } from "@/components/AvailabilityNote";
import { OrderingSteps } from "@/components/OrderingSteps";
import { currentAvailability, heroSlides, site } from "@/lib/content";
import { getRootedFarmersHref } from "@/lib/links";
import type { HeroFrame } from "@/lib/content";
import type { HeroLayout } from "@/lib/snapshots/types";

type HomePageContentProps = {
  heroFrame?: HeroFrame;
  heroLayout?: HeroLayout;
};

export function HomePageContent({
  heroFrame = "bleed",
  heroLayout = "immersive",
}: HomePageContentProps) {
  const featured = currentAvailability.slice(0, 2);

  return (
    <>
      <HeroSlider
        slides={heroSlides}
        frame={heroFrame}
        layout={heroLayout}
        title={site.name}
        subtitle={site.tagline}
        primaryCta={{
          label: "View Current Availability",
          href: getRootedFarmersHref(),
        }}
        secondaryCta={{
          label: "Inquire About Flowers",
          href: "/contact?subject=flowers",
        }}
      />

      <Section
        eyebrow="Welcome"
        title="Flowers grown slowly, shared seasonally"
        description="At Grey Gables Farm, we cultivate thoughtful blooms for everyday joy, intimate gatherings, and milestone celebrations. Every bouquet is gathered fresh from our Louisa fields."
      >
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="image-frame relative aspect-[4/5]">
            <Image
              src="/images/bb.jpg"
              alt="Mixed seasonal bouquet from Grey Gables Farm"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="space-y-6">
            <p className="text-stone leading-relaxed">
              We believe in the quiet beauty of seasonal flowers — the kind
              that feel at home on a kitchen table, along a garden path, or
              at a gathering you&apos;ve been planning for months.
            </p>
            <p className="text-stone leading-relaxed">
              Our work is rooted in care for the land, our community, and the
              stories that flowers help tell.
            </p>
            <Button href="/about" variant="outline">
              Our story
            </Button>
          </div>
        </div>
      </Section>

      <Section
        variant="surface"
        eyebrow="This week"
        title="What's in bloom"
        description="A glimpse of what we're offering right now. For the full list and to order, visit our availability page."
      >
        <div className="mb-8">
          <AvailabilityNote />
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {featured.map((item) => (
            <AvailabilityCard key={item.id} item={item} />
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button href={getRootedFarmersHref()} variant="primary">
            View Current Availability
          </Button>
          <Button href="/flowers" variant="outline">
            See all flowers
          </Button>
        </div>
      </Section>

      <Section variant="muted" eyebrow="Ordering" title="How to order">
        <OrderingSteps />
      </Section>

      <Section variant="surface">
        <CTA
          title="Planning a special event?"
          description="We'd love to hear about your vision. From intimate gatherings to full celebration florals, we create designs that feel personal and seasonally inspired."
          primary={{
            label: "Events",
            href: "/weddings",
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
