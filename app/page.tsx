import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { CTA } from "@/components/CTA";
import { Button } from "@/components/Button";
import { AvailabilityCard } from "@/components/AvailabilityCard";
import { currentAvailability, site } from "@/lib/content";
import { getRootedFarmersHref } from "@/lib/links";

export default function HomePage() {
  const featured = currentAvailability.slice(0, 2);

  return (
    <>
      <Hero
        title={site.name}
        subtitle={site.tagline}
        imageSrc="/images/placeholders/hero.svg"
        imageAlt="Placeholder — replace with signature farm or field photo"
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
        description="At Grey Gables Farm, we cultivate thoughtful blooms for everyday joy, intimate gatherings, and milestone celebrations. Every bouquet is gathered fresh from our Hudson Valley fields."
      >
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-parchment">
            {/* PHOTO: Replace with farm portrait, greenhouse, or founder photo */}
            <Image
              src="/images/placeholders/about-preview.svg"
              alt="Placeholder — replace with farm or team photo"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="space-y-6">
            <p className="text-stone leading-relaxed">
              We believe in the quiet beauty of seasonal flowers — the kind
              that feel at home on a kitchen table, along a garden path, or
              beside you on your wedding day.
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
        variant="white"
        eyebrow="This week"
        title="What&apos;s in bloom"
        description="A glimpse of what we're offering right now. For the full list and to order, visit our availability page."
      >
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

      <Section variant="parchment">
        <CTA
          title="Planning a wedding or special event?"
          description="We'd love to hear about your vision. From intimate elopements to full celebration florals, we create designs that feel personal and seasonally inspired."
          primary={{
            label: "Weddings & Events",
            href: "/weddings",
          }}
          secondary={{
            label: "Inquire About Flowers",
            href: "/contact?subject=flowers",
          }}
        />
      </Section>

      <Section
        variant="white"
        eyebrow="Gallery"
        title="Life at the farm"
        description="Moments from the field, the studio, and celebrations we've been honored to be part of."
      >
        {/* PHOTO: Gallery previews — swap placeholders in lib/content.ts */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {["/images/placeholders/gallery-1.svg", "/images/placeholders/gallery-2.svg", "/images/placeholders/gallery-3.svg"].map((src, i) => (
            <div key={src} className={`relative overflow-hidden rounded-lg bg-parchment ${i === 1 ? "col-span-1 row-span-1 aspect-[3/4]" : "aspect-square"}`}>
              <Image
                src={src}
                alt={`Placeholder gallery preview ${i + 1}`}
                fill
                className="object-cover"
                sizes="33vw"
              />
            </div>
          ))}
        </div>
        <Link
          href="/gallery"
          className="mt-8 inline-block font-medium text-sage-dark hover:text-sage transition-colors"
        >
          View the gallery →
        </Link>
      </Section>
    </>
  );
}
