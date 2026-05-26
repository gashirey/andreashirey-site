import Link from "next/link";
import { homeCta as defaultHomeCta } from "@/lib/content";
import { inquiryCtas } from "@/lib/inquiry/copy";
import type { ResolvedSiteCopy } from "@/lib/site-cms/types";

type HomeContactCtaProps = {
  homeCta?: ResolvedSiteCopy["homeCta"];
};

export function HomeContactCta({ homeCta = defaultHomeCta }: HomeContactCtaProps) {
  return (
    <section className="border-t border-parchment bg-site-page py-14 md:py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 sm:flex-row sm:items-center sm:justify-between lg:px-10">
        {homeCta.note ? (
          <p className="type-page-body max-w-md text-stone">{homeCta.note}</p>
        ) : null}
        <Link
          href={inquiryCtas.primary.href}
          className="btn border-salmon-dark bg-salmon-dark text-white hover:bg-salmon"
        >
          {homeCta.contact}
        </Link>
      </div>
    </section>
  );
}
