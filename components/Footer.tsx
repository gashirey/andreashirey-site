import Image from "next/image";
import Link from "next/link";
import { SubscribeBlock } from "@/components/SubscribeBlock";
import { nav, site, social } from "@/lib/content";
import { googleMapsUrl } from "@/lib/location";
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-parchment bg-site-surface">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Image
              src={site.logo}
              alt={site.logoAlt}
              width={160}
              height={40}
              className="h-9 w-auto object-contain object-left"
            />
            <p className="mt-3 font-serif text-xl text-bark">{site.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-stone">
              {site.description}
            </p>
          </div>

          <div className="lg:col-span-2">
            <ul className="mt-1 flex flex-col gap-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-bark/80 transition-colors hover:text-salmon-dark"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <SubscribeBlock />
          </div>

          <div className="lg:col-span-3">
            <p className="text-xs font-medium tracking-wide text-stone">
              Contact
            </p>
            <a
              href={googleMapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block text-sm leading-relaxed text-bark/80 transition-colors hover:text-salmon-dark"
            >
              {site.location}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="mt-2 inline-block text-sm text-salmon-dark transition-colors hover:text-salmon"
            >
              {site.email}
            </a>
            {social.instagram ? (
              <a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-sm text-salmon-dark transition-colors hover:text-salmon"
              >
                Instagram
              </a>
            ) : null}
          </div>
        </div>

        <p className="mt-10 border-t border-parchment pt-6 text-center text-xs text-stone">
          © {year} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
