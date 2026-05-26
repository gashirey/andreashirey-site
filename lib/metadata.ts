import type { Metadata } from "next";
import { site } from "./content";

const ogImage = "/images/hero.jpg";

export function pageMetadata({
  title,
  description,
  path = "",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const url = `https://${site.domain}${path}`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${site.brand}`,
      description,
      url,
      siteName: site.name,
      locale: "en_US",
      type: "website",
      images: [{ url: ogImage, alt: site.brand }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.brand}`,
      description,
    },
  };
}
