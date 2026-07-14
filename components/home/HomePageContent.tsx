import Link from "next/link";
import {
  HeroSlider,
  HOME_HERO_FADE_MS,
  type HeroSlide,
} from "@/components/HeroSlider";
import { Section } from "@/components/Section";
import { HomeContactCta } from "@/components/home/HomeContactCta";
import {
  heroHome as heroHomeDefaults,
  heroHomeSlide,
  homeAbout as homeAboutDefaults,
} from "@/lib/content";
import type { HeroFrame } from "@/lib/content";
import { HOME_HERO_SLIDE_INTERVAL_DEFAULT_MS } from "@/lib/site-cms/hero-slider";
import type { ResolvedSiteCopy } from "@/lib/site-cms/types";
import type { SiteMediaSlotKey, SiteMediaView } from "@/lib/site-media/slots";
import type { HeroLayout } from "@/lib/snapshots/types";

type SiteMediaMap = Record<SiteMediaSlotKey, SiteMediaView>;

const STATIC_SITE_MEDIA: SiteMediaMap = {
  hero: { imageUrl: heroHomeSlide.src, alt: heroHomeSlide.alt, focalX: 50, focalY: 50 },
  home_feature: {
    imageUrl: "/images/bb.jpg",
    alt: "Editorial photograph by Andrea Shirey",
    focalX: 50,
    focalY: 50,
  },
  about: {
    imageUrl: "/images/garden_row.jpg",
    alt: "Photograph by Andrea Shirey",
    focalX: 50,
    focalY: 50,
  },
};

type HomePageContentProps = {
  heroFrame?: HeroFrame;
  heroLayout?: HeroLayout;
  siteMedia?: SiteMediaMap;
  heroSlides?: readonly HeroSlide[];
  heroSlideIntervalMs?: number;
  copy?: ResolvedSiteCopy;
};

export function HomePageContent({
  heroFrame = "bleed",
  heroLayout = "immersive",
  siteMedia: _siteMedia = STATIC_SITE_MEDIA,
  heroSlides = [],
  heroSlideIntervalMs = HOME_HERO_SLIDE_INTERVAL_DEFAULT_MS,
  copy,
}: HomePageContentProps) {
  const heroHome = copy?.heroHome ?? {
    title: heroHomeDefaults.title,
    subtitle: heroHomeDefaults.subtitle,
    primaryCta: heroHomeDefaults.primaryCta,
  };
  const homeAbout = copy?.homeAbout ?? [...homeAboutDefaults];
  const homeCta = copy?.homeCta;
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
        secondaryCta={heroHomeDefaults.secondaryCta}
        showSlideControls={multiHero}
        slideIntervalMs={heroSlideIntervalMs}
        fadeMs={HOME_HERO_FADE_MS}
      />

      <Section density="compact">
        <div className="max-w-lg space-y-4">
          {homeAbout.map((paragraph) => (
            <p
              key={paragraph.slice(0, 24)}
              className="type-page-body leading-relaxed text-stone"
            >
              {paragraph}
            </p>
          ))}
          <p className="pt-2 text-sm">
            <Link
              href="/about"
              className="text-bark underline underline-offset-4 decoration-parchment hover:text-salmon-dark"
            >
              About
            </Link>
            {" · "}
            <Link
              href="/sessions"
              className="text-bark underline underline-offset-4 decoration-parchment hover:text-salmon-dark"
            >
              Sessions
            </Link>
          </p>
        </div>
      </Section>

      <HomeContactCta homeCta={homeCta} />
    </>
  );
}
