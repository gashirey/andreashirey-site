import Link from "next/link";
import { homeCta } from "@/lib/content";
import { getRootedFarmersHref } from "@/lib/links";

export function FarmCtaStrip() {
  const rootedHref = getRootedFarmersHref();
  const rootedExternal = rootedHref.startsWith("http");

  return (
    <section className="border-t border-parchment bg-site-page py-14 md:py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <p className="max-w-md text-sm text-stone">{homeCta.note}</p>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium">
          <Link
            href={rootedHref}
            {...(rootedExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="text-bark underline underline-offset-4 decoration-parchment transition-colors hover:text-salmon-dark hover:decoration-salmon-dark"
          >
            {homeCta.rooted}
          </Link>
          <Link
            href="/contact"
            className="text-bark underline underline-offset-4 decoration-parchment transition-colors hover:text-salmon-dark hover:decoration-salmon-dark"
          >
            {homeCta.contact}
          </Link>
        </div>
      </div>
    </section>
  );
}
