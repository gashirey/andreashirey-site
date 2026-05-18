"use client";

import Link from "next/link";
import { designDirections } from "@/lib/design-lab/directions";

export function DesignLabNav() {
  return (
    <nav
      className="sticky top-0 z-40 border-b border-bark/10 bg-cream/95"
      aria-label="Design lab"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-3">
        <div>
          <p className="font-serif text-lg text-bark">Design Lab</p>
          <p className="text-xs text-stone">Grey Gables Farm — internal</p>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-stone">
          {designDirections.map((d) => (
            <li key={d.id}>
              <a
                href={`#direction-${d.id}`}
                className="transition-colors hover:text-sage-dark"
              >
                {d.id.toUpperCase()}: {d.name}
              </a>
            </li>
          ))}
          <li>
            <Link href="/" className="transition-colors hover:text-sage-dark">
              ← Site
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
