import Image from "next/image";
import { Suspense } from "react";
import { HeroSlider } from "@/components/HeroSlider";
import { Section } from "@/components/Section";
import { Button } from "@/components/Button";
import { AvailableNowSection } from "@/components/inventory/AvailableNowSection";
import { heroHome, heroSlides, site } from "@/lib/content";
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
        slides={heroSlides}
        frame={heroFrame}
        layout={heroLayout}
        title={heroHome.title}
        subtitle={heroHome.subtitle}
        primaryCta={heroHome.primaryCta}
      />

      <Section
        title="Currently available"
        description="Limited weekly harvests."
      >
        <Suspense
          fallback={
            <div className="grid gap-10 sm:grid-cols-2">
              {[1, 2].map((n) => (
                <div key={n} className="card aspect-[4/3] bg-parchment" aria-hidden />
              ))}
            </div>
          }
        >
          <AvailableNowSection showHeading={false} />
        </Suspense>
      </Section>

      <Section variant="muted">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="image-frame relative aspect-[5/4] lg:aspect-[4/3]">
            <Image
              src="/images/garden_row.jpg"
              alt="Cutting garden at Grey Gables Farm"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="max-w-md space-y-6">
            <p className="text-base leading-relaxed text-stone md:text-lg">
              Flowers for tables, markets, and everyday use — grown in{" "}
              {site.locationShort}.
            </p>
            <Button href="/about" variant="outline">
              About the farm
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
