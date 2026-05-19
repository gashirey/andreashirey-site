import type { Metadata } from "next";
import Image from "next/image";
import { Section } from "@/components/Section";
import { Button } from "@/components/Button";
import { site } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: `Grey Gables Farm — seasonal cut flowers in ${site.locationRegion}.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Section className="pt-24 md:pt-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-md">
            <h1 className="font-serif text-4xl font-medium leading-tight text-bark md:text-5xl">
              About Grey Gables Farm
            </h1>
            <div className="mt-8 space-y-4 text-base leading-relaxed text-stone">
              <p>
                Grey Gables Farm is a Central Virginia flower farm growing
                seasonal cut flowers for local markets, events, and everyday
                use.
              </p>
              <p>
                We focus on varieties that hold well, photograph cleanly, and
                match the season.
              </p>
            </div>
            <p className="mt-6 text-sm text-stone">
              {site.locationShort} —{" "}
              <a
                href="/contact"
                className="text-salmon-dark underline underline-offset-2"
              >
                directions & contact
              </a>
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/available-now" variant="primary">
                View availability
              </Button>
              <Button href="/contact" variant="outline">
                Contact
              </Button>
            </div>
          </div>
          <div className="image-frame relative aspect-[4/5] min-h-[280px]">
            <Image
              src="/images/garden_row.jpg"
              alt="Cutting garden at Grey Gables Farm"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </Section>
    </>
  );
}
