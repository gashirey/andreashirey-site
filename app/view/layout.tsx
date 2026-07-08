import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ClientViewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="site-theme type-body min-h-full bg-cream text-bark">
      {children}
    </div>
  );
}
