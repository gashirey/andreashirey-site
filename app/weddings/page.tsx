import type { Metadata } from "next";
import Image from "next/image";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { CTA } from "@/components/CTA";
import { Button } from "@/components/Button";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Weddings & Events",
  description: `Wedding and event florals by ${site.name} — intimate, seasonal designs in the Hudson Valley.`,
};

const services = [
  {
    title: "Bridal & personal flowers",
    text: "Bouquets, boutonnieres, and corsages designed to complement your palette and season.",
  },
  {
    title: "Ceremony installations",
    text: "Arches, aisle markers, and altar arrangements that frame your moment beautifully.",
  },
  {
    title: "Reception & celebration",
    text: "Centerpieces, mantels, and statement pieces — from intimate dinners to full receptions.",
  },
];

export default function WeddingsPage() {
  return (
    <>
      <Hero
        compact
        title="Weddings & events"
        subtitle="Romantic, seasonal florals for the moments that matter most"
        imageSrc="/images/placeholders/weddings-hero.svg"
        imageAlt="Placeholder — replace with wedding bouquet or ceremony florals photo"
        primaryCta={{
          label: "Request a consultation",
          href: "/contact?subject=wedding",
        }}
      />

      <Section
        title="Florals with feeling"
        description="We partner with couples and hosts to create designs that feel effortless, personal, and deeply connected to the season."
      >
        <div className="grid gap-12 lg:grid-cols-2">
          <ul className="space-y-8">
            {services.map((service) => (
              <li key={service.title}>
                <h3 className="font-serif text-xl text-bark">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone">
                  {service.text}
                </p>
              </li>
            ))}
          </ul>
          <div className="relative aspect-square overflow-hidden rounded-xl bg-parchment">
            {/* PHOTO: Replace with wedding tablescape or ceremony photo */}
            <Image
              src="/images/placeholders/wedding-detail.svg"
              alt="Placeholder — replace with wedding floral detail photo"
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
        </div>
      </Section>

      <Section variant="white" title="How we work together">
        <ol className="grid gap-8 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Share your vision",
              text: "Tell us about your date, venue, style, and the feeling you want your florals to evoke.",
            },
            {
              step: "02",
              title: "Receive a proposal",
              text: "We'll suggest seasonal flowers, palettes, and a plan tailored to your celebration.",
            },
            {
              step: "03",
              title: "Enjoy the day",
              text: "We deliver, install, and ensure every stem is in place — so you can be fully present.",
            },
          ].map((item) => (
            <li key={item.step} className="border-t border-parchment pt-6">
              <span className="text-xs font-medium tracking-[0.2em] text-sage">
                {item.step}
              </span>
              <h3 className="mt-2 font-serif text-xl text-bark">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone">{item.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12">
          <Button href="/contact?subject=wedding" variant="primary">
            Inquire about your event
          </Button>
        </div>
      </Section>

      <Section variant="parchment">
        <CTA
          title="Let's create something beautiful together"
          description="Share your date, venue, and inspiration — we'll respond within a few business days."
          primary={{
            label: "Send an inquiry",
            href: "/contact?subject=wedding",
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
