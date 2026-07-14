import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Section } from "@/components/Section";
import { ContactForm } from "@/components/ContactForm";
import { site, social } from "@/lib/content";
import { inquiryCtas } from "@/lib/inquiry/copy";
import { formatLocationLine } from "@/lib/location";
import { pageMetadata } from "@/lib/metadata";
import { focalObjectPosition } from "@/lib/site-cms/focal";
import { getPublicSiteConfig } from "@/lib/site-cms/queries";
import { getSiteMediaSlots } from "@/lib/site-media/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: `Contact ${site.brand}.`,
  path: "/contact",
});

export default async function ContactPage() {
  const [siteMedia, config] = await Promise.all([
    getSiteMediaSlots(),
    getPublicSiteConfig(),
  ]);
  const copy = config.copy.contactPage;
  const photo = siteMedia.contact;
  const hasPhoto = Boolean(photo.imageUrl);

  return (
    <Section density="compact" className="pt-20 md:pt-28">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
        <div className="max-w-md space-y-8">
          <div>
            <h1 className="type-page-title leading-tight">{copy.title}</h1>
            <p className="type-page-body mt-6 leading-relaxed text-stone whitespace-pre-wrap">
              {copy.intro}
            </p>
            <p className="mt-4 text-sm">
              <Link
                href={inquiryCtas.primary.href}
                className="text-bark underline underline-offset-4 decoration-parchment hover:text-salmon-dark"
              >
                Inquire
              </Link>
              {" · "}
              <Link
                href="/sessions"
                className="text-bark underline underline-offset-4 decoration-parchment hover:text-salmon-dark"
              >
                Sessions
              </Link>
            </p>
          </div>

          {hasPhoto ? (
            <div className="relative aspect-[4/5] w-full max-w-sm bg-parchment">
              <Image
                src={photo.imageUrl}
                alt={photo.alt || "Andrea Shirey Photography"}
                fill
                className="object-cover"
                style={{
                  objectPosition: focalObjectPosition(
                    photo.focalX,
                    photo.focalY,
                  ),
                }}
                sizes="(max-width: 1024px) 100vw, 28rem"
                unoptimized={photo.imageUrl.startsWith("http")}
              />
            </div>
          ) : null}

          <dl className="space-y-4 text-sm">
            <div>
              <dt className="font-medium text-bark">Email</dt>
              <dd>
                <a
                  href={`mailto:${site.email}`}
                  className="text-salmon-dark underline underline-offset-2"
                >
                  {site.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-medium text-bark">Based in</dt>
              <dd className="text-stone">{formatLocationLine()}</dd>
            </div>
            {social.instagram ? (
              <div>
                <dt className="font-medium text-bark">Instagram</dt>
                <dd>
                  <a
                    href={social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-salmon-dark underline underline-offset-2"
                  >
                    Follow
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
        </div>

        <Suspense
          fallback={<div className="card h-96 bg-parchment" aria-hidden />}
        >
          <ContactForm />
        </Suspense>
      </div>
    </Section>
  );
}
