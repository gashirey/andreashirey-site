"use client";

import Link from "next/link";
import { site, social } from "@/lib/content";
import { useSiteConfig } from "@/components/SiteConfigProvider";
import { formatLocationLine } from "@/lib/location";

export function Footer() {
  const { nav, copy } = useSiteConfig();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-parchment bg-site-surface">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-serif text-lg text-bark">{site.name}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-stone">
              Photography
            </p>
            <p className="type-footer-text mt-4 max-w-sm leading-relaxed">
              {copy.site.description}
            </p>
          </div>

          <div className="md:col-span-3">
            <ul className="flex flex-col gap-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="type-footer-link transition-colors hover:text-salmon-dark"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-xs font-medium tracking-wide text-stone">
              Contact
            </p>
            <p className="type-footer-text mt-4 text-stone">
              {formatLocationLine()}
            </p>
            <a
              href={`mailto:${site.email}`}
              className="type-footer-link mt-2 inline-block text-salmon-dark transition-colors hover:text-salmon"
            >
              {site.email}
            </a>
            {social.instagram ? (
              <a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="type-footer-link mt-2 block text-salmon-dark transition-colors hover:text-salmon"
              >
                Instagram
              </a>
            ) : null}
          </div>
        </div>

        <p className="mt-10 border-t border-parchment pt-6 text-center text-xs text-stone">
          © {year} {site.brand}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
