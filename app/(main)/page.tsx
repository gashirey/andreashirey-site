import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { CTA } from "@/components/CTA";
import { Button } from "@/components/Button";
import { AvailabilityCard } from "@/components/AvailabilityCard";
import { AvailabilityNote } from "@/components/AvailabilityNote";
import { OrderingSteps } from "@/components/OrderingSteps";
import { currentAvailability, galleryImages, site } from "@/lib/content";
import { getRootedFarmersHref } from "@/lib/links";

export default function HomePage() {
  const featured = currentAvailability.slice(0, 2);
  const galleryPreview = galleryImages.slice(0, 3);

  return (
    <>
      <Hero
        title={site.name}
        subtitle={site.tagline}
        imageSrc={site.heroImage}
        imageAlt={site.heroImageAlt}
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

      <Section variant="parchment" eyebrow="Ordering" title="How to order">
        <OrderingSteps />
      </Section>

      <Section variant="white">
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
        eyebrow="Gallery"
        title="Life at the farm"
        description="Moments from the field, the studio, and celebrations we've been honored to be part of."
      >
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {galleryPreview.map((image, i) => (
            <div
              key={image.id}
              className={`image-frame relative ${
                i === 1 ? "aspect-[3/4]" : "aspect-square"
              }`}
            >
              {/* PHOTO: swap in lib/content.ts → galleryImages */}
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="33vw"
              />
            </div>
          ))}
        </div>
        <Link
          href="/gallery"
          className="mt-8 inline-block font-medium text-salmon-dark hover:text-salmon transition-colors"
        >
          View the gallery →
        </Link>
      </Section>
    </>
  );
}
