import { HomePageContent } from "@/components/home/HomePageContent";
import { activeHeroFrame, activeHeroLayout } from "@/lib/site-theme";
import { getSiteMediaSlots } from "@/lib/site-media/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const siteMedia = await getSiteMediaSlots();

  return (
    <HomePageContent
      heroFrame={activeHeroFrame}
      heroLayout={activeHeroLayout}
      siteMedia={siteMedia}
    />
  );
}
