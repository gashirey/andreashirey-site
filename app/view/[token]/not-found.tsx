import Link from "next/link";
import { site } from "@/lib/content";

export default function ClientGalleryNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col justify-center px-6 py-16 text-center">
      <p className="text-xs uppercase tracking-[0.14em] text-stone">
        {site.brand}
      </p>
      <h1 className="type-page-title mt-4 text-bark">Gallery unavailable</h1>
      <p className="type-page-body mt-4 text-stone leading-relaxed">
        This link may be incorrect, unpublished, or expired. If you expected a
        gallery here, contact Andrea for an updated link.
      </p>
      <p className="mt-8">
        <a
          href={`mailto:${site.email}`}
          className="btn inline-flex border-bark bg-bark text-cream hover:bg-stone"
        >
          Email Andrea
        </a>
      </p>
      <p className="mt-6 text-sm text-stone">
        <Link href="/" className="underline underline-offset-2 hover:text-bark">
          Visit the main site
        </Link>
      </p>
    </div>
  );
}
