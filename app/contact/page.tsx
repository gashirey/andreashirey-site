import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name} — flower inquiries, weddings, and general questions.`,
};

type ContactPageProps = {
  searchParams: Promise<{ subject?: string }>;
};

const subjectLabels: Record<string, string> = {
  flowers: "Flower inquiry",
  wedding: "Wedding or event inquiry",
  general: "General question",
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const subjectKey = params.subject ?? "general";
  const subjectLabel = subjectLabels[subjectKey] ?? subjectLabels.general;

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
            </dl>
          </div>

          <form
            className="rounded-xl border border-parchment bg-white p-8 shadow-sm"
            action={`mailto:${site.email}`}
            method="post"
            encType="text/plain"
          >
            <p className="mb-6 text-sm text-stone">
              This form opens your email client. For a embedded form later,
              connect Formspree, Basin, or similar.
            </p>

            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-bark">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1 w-full rounded-lg border border-parchment bg-cream px-4 py-2.5 text-bark outline-none focus:border-sage focus:ring-1 focus:ring-sage"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-bark">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 w-full rounded-lg border border-parchment bg-cream px-4 py-2.5 text-bark outline-none focus:border-sage focus:ring-1 focus:ring-sage"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-bark">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  defaultValue={subjectKey}
                  className="mt-1 w-full rounded-lg border border-parchment bg-cream px-4 py-2.5 text-bark outline-none focus:border-sage focus:ring-1 focus:ring-sage"
                >
                  <option value="flowers">Flower inquiry</option>
                  <option value="wedding">Wedding or event</option>
                  <option value="general">General question</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-bark">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  placeholder={`Tell us about your ${subjectLabel.toLowerCase()}...`}
                  className="mt-1 w-full resize-y rounded-lg border border-parchment bg-cream px-4 py-2.5 text-bark outline-none focus:border-sage focus:ring-1 focus:ring-sage"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-sage-dark px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-sage"
              >
                Send message
              </button>
            </div>
          </form>
        </div>
      </Section>
    </>
  );
}
