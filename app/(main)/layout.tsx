import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SiteConfigProvider } from "@/components/SiteConfigProvider";
import { getPublicSiteConfig, getResolvedSiteTheme } from "@/lib/site-cms/queries";

export default async function MainSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [config, { themeStyle }] = await Promise.all([
    getPublicSiteConfig(),
    getResolvedSiteTheme(),
  ]);

  return (
    <SiteConfigProvider config={config}>
      <div className="site-theme flex min-h-full flex-col" style={themeStyle}>
        <AnnouncementBar />
        <Header />
        {children}
        <Footer />
      </div>
    </SiteConfigProvider>
  );
}
