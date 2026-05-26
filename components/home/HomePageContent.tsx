import Image from "next/image";
import Link from "next/link";
import {
  HeroSlider,
  HOME_HERO_FADE_MS,
  HOME_HERO_SLIDE_MS,
  type HeroSlide,
} from "@/components/HeroSlider";
import { Section } from "@/components/Section";
import { GalleryGrid } from "@/components/GalleryGrid";
import { HomeContactCta } from "@/components/home/HomeContactCta";
import { galleryImages, heroHome as heroHomeDefaults, heroHomeSlide } from "@/lib/content";
import type { HeroFrame } from "@/lib/content";
import { focalObjectPosition } from "@/lib/site-cms/focal";
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

const selectedWorkImages = galleryImages.slice(0, 2);
const featuredGalleryImages = galleryImages.slice(2, 5);

type HomePageContentProps = {
  heroFrame?: HeroFrame;
  heroLayout?: HeroLayout;
  siteMedia?: SiteMediaMap;
  heroSlides?: readonly HeroSlide[];
  copy?: ResolvedSiteCopy;
};

export function HomePageContent({
  heroFrame = "bleed",
  heroLayout = "immersive",
  siteMedia = STATIC_SITE_MEDIA,
  heroSlides = [{ src: STATIC_SITE_MEDIA.hero.imageUrl, alt: STATIC_SITE_MEDIA.hero.alt }],
  copy,
}: HomePageContentProps) {
  const heroHome = copy?.heroHome ?? {
    title: heroHomeDefaults.title,
    subtitle: heroHomeDefaults.subtitle,
    primaryCta: heroHomeDefaults.primaryCta,
  };
  const homeAbout = copy?.homeAbout ?? [
    "Photographs made slowly — attention to light, distance, and the ordinary.",
  ];
  const homeSections = copy?.homeSections ?? {
    selectedWork: { title: "Selected work", description: "" },
    featuredGallery: { title: "From the archive", description: "" },
  };
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
        slideIntervalMs={HOME_HERO_SLIDE_MS}
        fadeMs={HOME_HERO_FADE_MS}
      />

      <Section
        density="compact"
        title={homeSections.selectedWork.title}
        description={homeSections.selectedWork.description || undefined}
      >
        <GalleryGrid
          images={selectedWorkImages}
          density="compact"
          priorityCount={2}
        />
        <p className="mt-8 text-sm">
          <Link
            href="/gallery"
            className="text-bark underline underline-offset-4 decoration-parchment hover:text-salmon-dark"
          >
            View all work
          </Link>
        </p>
      </Section>

      <Section density="compact" className="!pt-0">
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
          </p>
        </div>
      </Section>

      <section className="relative aspect-[5/4] w-full bg-parchment sm:aspect-[16/10]">
        <Image
          src={siteMedia.home_feature.imageUrl}
          alt={siteMedia.home_feature.alt}
          fill
          className="object-cover"
          style={{
            objectPosition: focalObjectPosition(
              siteMedia.home_feature.focalX,
              siteMedia.home_feature.focalY,
            ),
          }}
          sizes="100vw"
          unoptimized={siteMedia.home_feature.imageUrl.startsWith("http")}
        />
      </section>

      <Section
        density="compact"
        title={homeSections.featuredGallery.title}
        description={homeSections.featuredGallery.description || undefined}
        className="!pt-10"
      >
        <GalleryGrid images={featuredGalleryImages} density="compact" />
      </Section>

      <HomeContactCta homeCta={homeCta} />
    </>
  );
}
