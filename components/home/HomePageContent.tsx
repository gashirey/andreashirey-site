import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { HeroSlider } from "@/components/HeroSlider";
import { Section } from "@/components/Section";
import { AvailableNowSection } from "@/components/inventory/AvailableNowSection";
import { FarmCtaStrip } from "@/components/home/FarmCtaStrip";
import { heroHome, heroHomeSlide, homeAbout, homeSections } from "@/lib/content";
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
  return (
    <>
      <HeroSlider
        slides={[heroHomeSlide]}
        frame={heroFrame}
        layout={heroLayout}
        title={heroHome.title}
        subtitle={heroHome.subtitle}
        primaryCta={heroHome.primaryCta}
        showSlideControls={false}
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
          src="/images/bb.jpg"
          alt="Seasonal cut flowers from Grey Gables Farm"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </section>

      <FarmCtaStrip />
    </>
  );
}
