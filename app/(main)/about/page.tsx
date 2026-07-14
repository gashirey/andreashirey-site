import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/Section";
import { aboutPage, site } from "@/lib/content";
import { focalObjectPosition } from "@/lib/site-cms/focal";
import { getSiteMediaSlots } from "@/lib/site-media/queries";
import { inquiryCtas } from "@/lib/inquiry/copy";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: `About ${site.brand} — editorial photography in ${site.locationRegion}.`,
  path: "/about",
});

export default async function AboutPage() {
  const siteMedia = await getSiteMediaSlots();
  const about = siteMedia.about;

  return (
    <Section density="compact" className="pt-20 md:pt-28">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-start lg:gap-16">
        <div>
          <p className="type-eyebrow tracking-wide">{aboutPage.eyebrow}</p>
          <h1 className="type-page-title mt-2 leading-tight md:text-4xl">
            {aboutPage.title}
          </h1>
          <div className="mt-6 space-y-4">
            {aboutPage.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="type-page-body leading-relaxed text-stone"
              >
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <Link
              href={inquiryCtas.primary.href}
              className="btn border-salmon-dark bg-salmon-dark text-white hover:bg-salmon"
            >
              {inquiryCtas.secondary.label}
            </Link>
            <Link
              href="/sessions"
              className="text-bark underline underline-offset-4 decoration-parchment hover:text-salmon-dark"
            >
              The experience
            </Link>
            <Link
              href="/gallery"
              className="text-bark underline underline-offset-4 decoration-parchment hover:text-salmon-dark"
            >
              View work
            </Link>
          </div>
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
