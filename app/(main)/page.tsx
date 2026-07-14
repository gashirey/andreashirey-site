import { HomePageContent } from "@/components/home/HomePageContent";
import { getPublicSiteConfig } from "@/lib/site-cms/queries";
import { getSiteMediaSlots } from "@/lib/site-media/queries";
import { resolveHomeHeroSlides } from "@/lib/site-media/hero-slides";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [siteMedia, config] = await Promise.all([
    getSiteMediaSlots(),
    getPublicSiteConfig(),
  ]);
  const heroSlides = await resolveHomeHeroSlides();

  return (
    <HomePageContent
      heroFrame={config.theme.heroFrame}
      heroLayout={config.theme.heroLayout}
      siteMedia={siteMedia}
      heroSlides={heroSlides}
      heroSlideIntervalMs={config.theme.heroSlideIntervalMs}
      copy={config.copy}
    />
  );
}
