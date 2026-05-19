import type { Metadata } from "next";
import { Suspense } from "react";
import { Section } from "@/components/Section";
import { ContactForm } from "@/components/ContactForm";
import { LocationBlock } from "@/components/LocationBlock";
import { site, social } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: `Contact ${site.name} — orders and questions.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <Section className="pt-24 md:pt-32">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
        <div className="max-w-md">
          <h1 className="font-serif text-4xl font-medium leading-tight text-bark md:text-5xl">
            Contact
          </h1>
          <p className="mt-6 text-base leading-relaxed text-stone">
            Orders, availability, and event inquiries. We reply within a few
            business days.
          </p>
          <dl className="mt-8 space-y-4 text-sm">
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

      <LocationBlock className="mt-16 max-w-md border-t border-parchment pt-12" />
    </Section>
  );
}
