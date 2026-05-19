import { HomePageContent } from "@/components/home/HomePageContent";
import { activeHeroFrame, activeHeroLayout } from "@/lib/site-theme";

export default function HomePage() {
  return (
    <HomePageContent heroFrame={activeHeroFrame} heroLayout={activeHeroLayout} />
  );
}
