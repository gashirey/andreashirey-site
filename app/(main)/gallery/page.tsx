import type { Metadata } from "next";
import Link from "next/link";
import { GalleryGrid } from "@/components/GalleryGrid";
import { site } from "@/lib/content";
import { getPortfolioGalleryImages } from "@/lib/gallery/queries";
import { inquiryCtas } from "@/lib/inquiry/copy";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Work",
  description: `Selected photographs — ${site.brand}.`,
  path: "/gallery",
});

export default async function GalleryPage() {
  const images = await getPortfolioGalleryImages();

  return (
    <section className="bg-site-page pb-12 pt-20 md:pb-20 md:pt-28 lg:pb-24">
      <div className="mx-auto max-w-[88rem] px-6 lg:px-12">
        <header className="mb-12 max-w-md md:mb-16">
          <h1 className="type-page-title leading-tight md:text-4xl">Work</h1>
          <p className="type-page-body mt-4 text-stone leading-relaxed">
            Selected photographs.
          </p>
        </header>
        {images.length ? (
          <GalleryGrid images={images} priorityCount={2} density="full" />
        ) : (
          <div className="border-y border-parchment py-16 md:py-20">
            <p className="type-page-body max-w-md leading-relaxed text-stone">
              New work is being prepared for this gallery.
            </p>
          </div>
        )}

        <div className="mt-16 border-t border-parchment pt-12 md:mt-20">
          <p className="type-page-body max-w-md text-stone leading-relaxed">
            Interested in a session? Andrea accepts a limited number of
            projects each season.
          </p>
          <Link
            href={inquiryCtas.primary.href}
            className="btn mt-6 inline-flex border-salmon-dark bg-salmon-dark text-white hover:bg-salmon"
          >
            {inquiryCtas.primary.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
