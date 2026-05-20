import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import {
  HeroSlider,
  HOME_HERO_FADE_MS,
  HOME_HERO_SLIDE_MS,
  type HeroSlide,
} from "@/components/HeroSlider";
import { Section } from "@/components/Section";
import { AvailableNowSection } from "@/components/inventory/AvailableNowSection";
import { FarmCtaStrip } from "@/components/home/FarmCtaStrip";
import { heroHome, heroHomeSlide, homeAbout, homeSections } from "@/lib/content";
import type { HeroFrame } from "@/lib/content";
import type { SiteMediaSlotKey } from "@/lib/site-media/slots";
import type { HeroLayout } from "@/lib/snapshots/types";

type SiteMediaMap = Record<SiteMediaSlotKey, { imageUrl: string; alt: string }>;

const STATIC_SITE_MEDIA: SiteMediaMap = {
  hero: { imageUrl: heroHomeSlide.src, alt: heroHomeSlide.alt },
  home_feature: {
    imageUrl: "/images/bb.jpg",
    alt: "Seasonal cut flowers from Grey Gables Farm",
  },
  about: {
    imageUrl: "/images/garden_row.jpg",
    alt: "Cutting garden at Grey Gables Farm",
  },
};

type HomePageContentProps = {
  heroFrame?: HeroFrame;
  heroLayout?: HeroLayout;
  siteMedia?: SiteMediaMap;
  heroSlides?: readonly HeroSlide[];
};

export function HomePageContent({
  heroFrame = "bleed",
  heroLayout = "immersive",
  siteMedia = STATIC_SITE_MEDIA,
  heroSlides = [{ src: STATIC_SITE_MEDIA.hero.imageUrl, alt: STATIC_SITE_MEDIA.hero.alt }],
}: HomePageContentProps) {
  const multiHero = heroSlides.length > 1;

  return (
    <>
      <HeroSlider
        slides={heroSlides}
        frame={heroFrame}
        layout={heroLayout}
        title={heroHome.title}
        subtitle={heroHome.subtitle}
        primaryCta={heroHome.primaryCta}
        showSlideControls={multiHero}
        slideIntervalMs={HOME_HERO_SLIDE_MS}
        fadeMs={HOME_HERO_FADE_MS}
      />

      <Section
        density="compact"
        title={homeSections.availability.title}
        description={homeSections.availability.description}
      >
        <Suspense
          fallback={
            <div className="grid gap-8 sm:grid-cols-2" aria-hidden>
              {[1, 2].map((n) => (
                <div key={n} className="aspect-[4/3] bg-parchment" />
              ))}
            </div>
          }
        >
          <AvailableNowSection showHeading={false} limit={2} />
        </Suspense>
      </Section>

      <Section density="compact" className="!pt-0">
        <div className="max-w-lg space-y-4">
          {homeAbout.map((paragraph) => (
            <p
              key={paragraph.slice(0, 24)}
              className="text-base leading-relaxed text-stone"
            >
              {paragraph}
            </p>
          ))}
          <p className="pt-2 text-sm">
            <Link
              href="/about"
              className="text-bark underline underline-offset-4 decoration-parchment hover:text-salmon-dark"
            >
              About the farm
            </Link>
          </p>
        </div>
      </Section>

      <section className="relative aspect-[5/4] w-full bg-parchment sm:aspect-[16/10]">
        <Image
          src={siteMedia.home_feature.imageUrl}
          alt={siteMedia.home_feature.alt}
          fill
          className="object-cover"
          sizes="100vw"
          unoptimized={
            siteMedia.home_feature.imageUrl.startsWith("http")
          }
        />
      </section>

      <FarmCtaStrip />
    </>
  );
}
