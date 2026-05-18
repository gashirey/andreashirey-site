import type { Metadata } from "next";
import { Suspense } from "react";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { ContactForm } from "@/components/ContactForm";
import { site, social } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: `Get in touch with ${site.name} — flower inquiries, weddings, and general questions.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <Hero
        compact
        title="Contact us"
        subtitle="We'd love to hear from you"
        imageSrc="/images/placeholders/contact-hero.svg"
        imageAlt="Placeholder — replace with inviting farm or studio photo"
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl text-bark">Reach out</h2>
            <p className="mt-4 text-stone leading-relaxed">
              For flower orders, wedding consultations, or general questions,
              send us a note. We typically respond within 2–3 business days.
            </p>
            <dl className="mt-8 space-y-4 text-sm">
              <div>
                <dt className="font-medium text-bark">Email</dt>
                <dd>
                  <a
                    href={`mailto:${site.email}`}
                    className="text-sage-dark hover:text-sage transition-colors"
                  >
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-bark">Location</dt>
                <dd className="text-stone">{site.location}</dd>
              </div>
              {social.instagram ? (
                <div>
                  <dt className="font-medium text-bark">Instagram</dt>
                  <dd>
                    <a
                      href={social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sage-dark hover:text-sage transition-colors"
                    >
                      Follow us
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          <Suspense
            fallback={
              <div className="h-96 animate-pulse rounded-xl bg-parchment" aria-hidden />
            }
          >
            <ContactForm />
          </Suspense>
        </div>
      </Section>
    </>
  );
}
