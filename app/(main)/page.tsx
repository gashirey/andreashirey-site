import { HomePageContent } from "@/components/home/HomePageContent";
import { activeHeroFrame, activeHeroLayout } from "@/lib/site-theme";
import { getSiteMediaSlots } from "@/lib/site-media/queries";
import { resolveHomeHeroSlides } from "@/lib/site-media/hero-slides";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const siteMedia = await getSiteMediaSlots();
  const heroSlides = await resolveHomeHeroSlides({
    src: siteMedia.hero.imageUrl,
    alt: siteMedia.hero.alt,
  });

  return (
    <HomePageContent
      heroFrame={activeHeroFrame}
      heroLayout={activeHeroLayout}
      siteMedia={siteMedia}
      heroSlides={heroSlides}
    />
  );
}
