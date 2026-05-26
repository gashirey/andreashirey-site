import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/Section";
import { site } from "@/lib/content";
import { focalObjectPosition } from "@/lib/site-cms/focal";
import { getPublicSiteConfig } from "@/lib/site-cms/queries";
import { getSiteMediaSlots } from "@/lib/site-media/queries";
import { inquiryCtas } from "@/lib/inquiry/copy";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: `About ${site.brand} — editorial photography.`,
  path: "/about",
});

export default async function AboutPage() {
  const [siteMedia, config] = await Promise.all([
    getSiteMediaSlots(),
    getPublicSiteConfig(),
  ]);
  const about = siteMedia.about;
  const homeAbout = config.copy.homeAbout;

  return (
    <Section density="compact" className="pt-20 md:pt-28">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-start lg:gap-16">
        <div>
          <h1 className="type-page-title leading-tight md:text-4xl">About</h1>
          <div className="mt-6 space-y-4">
            {homeAbout.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="type-page-body leading-relaxed text-stone"
              >
                {paragraph}
              </p>
            ))}
          </div>
          <p className="mt-8 text-sm">
            <Link
              href={inquiryCtas.primary.href}
              className="text-bark underline underline-offset-4 decoration-parchment hover:text-salmon-dark"
            >
              {inquiryCtas.secondary.label}
            </Link>
            {" · "}
            <Link
              href="/gallery"
              className="text-bark underline underline-offset-4 decoration-parchment hover:text-salmon-dark"
            >
              View work
            </Link>
          </p>
        </div>
        <div className="relative aspect-[4/5] min-h-[320px] w-full bg-parchment lg:aspect-[3/4]">
          <Image
            src={about.imageUrl}
            alt={about.alt}
            fill
            className="object-cover"
            style={{
              objectPosition: focalObjectPosition(about.focalX, about.focalY),
            }}
            sizes="(max-width: 1024px) 100vw, 55vw"
            priority
            unoptimized={about.imageUrl.startsWith("http")}
          />
        </div>
      </div>
    </Section>
  );
}
