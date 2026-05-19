import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/Section";
import { homeAbout, site } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: `Seasonal cut flowers in ${site.locationRegion}.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <Section density="compact" className="pt-20 md:pt-28">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16 lg:items-start">
        <div>
          <h1 className="font-serif text-3xl font-medium leading-tight text-bark md:text-4xl">
            About
          </h1>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-stone">
            {homeAbout.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-6 text-sm text-stone">
            <Link
              href="/contact"
              className="text-bark underline underline-offset-4 decoration-parchment hover:text-salmon-dark"
            >
              Contact the farm
            </Link>
            {" · "}
            <Link
              href="/available-now"
              className="text-bark underline underline-offset-4 decoration-parchment hover:text-salmon-dark"
            >
              Current availability
            </Link>
          </p>
        </div>
        <div className="relative aspect-[4/5] min-h-[320px] w-full bg-parchment lg:aspect-[3/4]">
          <Image
            src="/images/garden_row.jpg"
            alt="Cutting garden at Grey Gables Farm"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 55vw"
            priority
          />
        </div>
      </div>
    </Section>
  );
}
