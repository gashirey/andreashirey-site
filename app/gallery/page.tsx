import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { GalleryGrid } from "@/components/GalleryGrid";
import { CTA } from "@/components/CTA";
import { galleryImages, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Gallery",
  description: `Photos from ${site.name} — the fields, bouquets, and celebrations we help bring to life.`,
};

export default function GalleryPage() {
  return (
    <>
      <Hero
        compact
        title="Gallery"
        subtitle="Scenes from the farm, the studio, and the celebrations we adore"
        imageSrc="/images/placeholders/gallery-hero.svg"
        imageAlt="Placeholder — replace with favorite gallery hero image"
      />

      <Section
        description="Replace placeholder images in lib/content.ts with your farm photography. Recommended: high-resolution JPG or WebP, consistent natural light."
      >
        {/* PHOTO: All gallery images are configured in lib/content.ts → galleryImages */}
        <GalleryGrid images={galleryImages} />
      </Section>

      <Section variant="parchment">
        <CTA
          title="Love what you see?"
          description="We'd be honored to create florals for your next gathering or help you find the perfect seasonal bunch."
          primary={{
            label: "Inquire About Flowers",
            href: "/contact?subject=flowers",
          }}
          secondary={{
            label: "Weddings & Events",
            href: "/weddings",
          }}
        />
      </Section>
    </>
  );
}
