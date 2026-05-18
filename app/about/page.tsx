import type { Metadata } from "next";
import Image from "next/image";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { CTA } from "@/components/CTA";
import { site } from "@/lib/content";
import { getRootedFarmersHref } from "@/lib/links";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${site.name} — our story, values, and approach to seasonal flower farming.`,
};

export default function AboutPage() {
  return (
    <>
      <Hero
        compact
        title="Our story"
        subtitle="A small farm with a big heart for seasonal beauty"
        imageSrc="/images/placeholders/about-hero.svg"
        imageAlt="Placeholder — replace with farm landscape or barn photo"
      />

      <Section title="Grey Gables Farm">
        <div className="max-w-3xl space-y-6 text-stone leading-relaxed">
          <p>
            Grey Gables Farm began with a simple wish: to grow flowers that
            feel honest, fragrant, and alive — the kind you want to bring
            inside and linger over.
          </p>
          <p>
            Nestled in the Hudson Valley, our fields and cutting gardens
            supply seasonal blooms for local bouquets, farmers markets, and
            celebrations throughout the year.
          </p>
          <p>
            We farm with intention — building healthy soil, choosing varieties
            for scent and texture, and harvesting at the moment they&apos;re
            ready, not a moment before.
          </p>
        </div>
      </Section>

      <Section variant="white" title="What we believe">
        <ul className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Seasonal first",
              text: "We grow with the rhythm of the seasons, celebrating each bloom at its peak.",
            },
            {
              title: "Thoughtful design",
              text: "Whether a simple bunch or full event florals, every arrangement is gathered with care.",
            },
            {
              title: "Community rooted",
              text: "We are proud to share our flowers with neighbors, couples, and makers in our region.",
            },
          ].map((value) => (
            <li
              key={value.title}
              className="rounded-xl border border-parchment bg-cream p-6"
            >
              <h3 className="font-serif text-xl text-bark">{value.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone">
                {value.text}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-parchment">
            {/* PHOTO: Replace with portrait of farmers or hands-in-soil image */}
            <Image
              src="/images/placeholders/farmers.svg"
              alt="Placeholder — replace with farmers or team photo"
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
          <div className="flex flex-col justify-center space-y-6">
            <h2 className="font-serif text-3xl text-bark">Visit the farm</h2>
            <p className="text-stone leading-relaxed">
              We welcome inquiries for farm visits during open days and by
              appointment. Follow along as we share seasonal updates and
              behind-the-scenes moments from the fields.
            </p>
            <p className="text-sm text-stone">{site.location}</p>
          </div>
        </div>
      </Section>

      <Section variant="parchment">
        <CTA
          title="Ready to bring our flowers home?"
          description="Browse what's available this week or send us a note — we'd love to help."
          primary={{
            label: "View Current Availability",
            href: getRootedFarmersHref(),
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
