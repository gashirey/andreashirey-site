"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/lib/content";
import { useSiteConfig } from "@/components/SiteConfigProvider";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive =
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`type-nav tracking-wide transition-colors ${
        isActive ? "font-medium text-salmon-dark" : "hover:opacity-80"
      }`}
    >
      {label}
    </Link>
  );
}

export function Header() {
  const { nav } = useSiteConfig();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header sticky top-0 z-50 border-b border-parchment bg-cream">
      <div className="mx-auto flex h-11 max-w-6xl items-center justify-between gap-4 px-4 lg:h-12 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center transition-opacity hover:opacity-85"
        >
          <Image
            src={site.logo}
            alt={site.logoAlt}
            width={180}
            height={44}
            priority
            className="h-7 w-auto max-w-[11rem] object-contain object-left lg:h-8 lg:max-w-[13rem]"
          />
        </Link>

        <nav className="hidden items-center gap-5 md:flex" aria-label="Main">
          {nav.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>

        <button
          type="button"
          className="flex shrink-0 flex-col gap-1 p-1.5 md:hidden"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span
            className={`block h-px w-5 bg-bark transition-transform ${menuOpen ? "translate-y-[4px] rotate-45" : ""}`}
          />
          <span
            className={`block h-px w-5 bg-bark transition-opacity ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-px w-5 bg-bark transition-transform ${menuOpen ? "-translate-y-[4px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {menuOpen && (
        <nav
          className="border-t border-parchment bg-cream px-4 py-4 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-3">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="type-nav block text-lg"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
