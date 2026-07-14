import {
  HeroSlider,
  HOME_HERO_FADE_MS,
  type HeroSlide,
} from "@/components/HeroSlider";
import {
  heroHome as heroHomeDefaults,
  heroHomeSlide,
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

/** Homepage body: hero slideshow only (site header/footer come from the layout). */
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
  const multiHero = heroSlides.length > 1;

  return (
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
  );
}
