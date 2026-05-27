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
    <section className="bg-site-page pb-12 pt-4 md:pb-16 md:pt-5">
      <div className="mx-auto max-w-[88rem] px-6 lg:px-12">
        {images.length ? (
          <GalleryGrid images={images} priorityCount={2} density="full" />
        ) : (
          <p className="type-page-body max-w-md py-12 text-stone leading-relaxed">
            New work is being prepared for this gallery.
          </p>
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
