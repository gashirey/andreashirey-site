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
  const [config, { themeStyle, googleFontsUrl }] = await Promise.all([
    getPublicSiteConfig(),
    getResolvedSiteTheme(),
  ]);

  return (
    <SiteConfigProvider config={config}>
      {googleFontsUrl ? (
        // eslint-disable-next-line @next/next/no-page-custom-font
        <link rel="stylesheet" href={googleFontsUrl} />
      ) : null}
      <div
        className="site-theme type-body flex min-h-full flex-col"
        style={themeStyle}
      >
        <AnnouncementBar />
        <Header />
        {children}
        <Footer />
      </div>
    </SiteConfigProvider>
  );
}
