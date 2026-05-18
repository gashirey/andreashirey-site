import Link from "next/link";
import { nav, site } from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-parchment bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-serif text-xl text-bark">{site.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-stone">
              {site.description}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-stone">
              Explore
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-bark/80 hover:text-sage-dark transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-stone">
              Get in touch
            </p>
            <p className="mt-4 text-sm text-bark/80">{site.location}</p>
            <a
              href={`mailto:${site.email}`}
              className="mt-2 inline-block text-sm text-sage-dark hover:text-sage transition-colors"
            >
              {site.email}
            </a>
          </div>
        </div>
        <p className="mt-10 border-t border-parchment pt-6 text-center text-xs text-stone">
          © {year} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
