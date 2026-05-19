import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { siteThemeStyle } from "@/lib/site-theme";

export default function MainSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="site-theme flex min-h-full flex-col" style={siteThemeStyle}>
      <AnnouncementBar />
      <Header />
      {children}
      <Footer />
    </div>
  );
}
