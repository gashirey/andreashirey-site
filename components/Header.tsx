"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav, site } from "@/lib/content";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive =
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`text-sm tracking-wide transition-colors ${
        isActive
          ? "text-salmon-dark font-medium"
          : "text-stone hover:text-bark"
      }`}
    >
      {label}
    </Link>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-parchment bg-cream">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="group flex flex-col">
          <span className="font-serif text-2xl font-medium tracking-tight text-bark transition-colors group-hover:text-salmon-dark">
            {site.name}
          </span>
          <span className="text-[0.65rem] uppercase tracking-[0.2em] text-stone">
            {site.location}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {nav.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>

        <button
          type="button"
          className="flex flex-col gap-1.5 p-2 md:hidden"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span
            className={`block h-px w-6 bg-bark transition-transform ${menuOpen ? "translate-y-[5px] rotate-45" : ""}`}
          />
          <span
            className={`block h-px w-6 bg-bark transition-opacity ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-px w-6 bg-bark transition-transform ${menuOpen ? "-translate-y-[5px] -rotate-45" : ""}`}
          />
        </button>
      </div>
      {menuOpen && (
        <nav
          className="border-t border-parchment bg-cream px-6 py-6 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-4">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block font-serif text-xl text-bark"
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
