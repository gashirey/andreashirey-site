import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { inquiryCtas } from "@/lib/inquiry/copy";
import { pageMetadata } from "@/lib/metadata";
import { sessionsPage } from "@/lib/sessions/content";

export const metadata: Metadata = pageMetadata({
  title: sessionsPage.metaTitle,
  description: sessionsPage.metaDescription,
  path: "/sessions",
});

export default function SessionsPage() {
  return (
    <>
      <Section density="compact" className="pt-20 md:pt-28">
        <header className="max-w-xl">
          <p className="type-eyebrow tracking-wide">{sessionsPage.eyebrow}</p>
          <h1 className="type-page-title mt-2 leading-tight md:text-4xl">
            {sessionsPage.title}
          </h1>
          <p className="type-page-body mt-5 max-w-lg text-stone leading-relaxed">
            {sessionsPage.intro}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={inquiryCtas.primary.href}
              className="btn border-salmon-dark bg-salmon-dark text-white hover:bg-salmon"
            >
              {inquiryCtas.primary.label}
            </Link>
            <Link
              href="/gallery"
              className="btn border-bark/25 bg-transparent text-bark hover:border-salmon-dark hover:text-salmon-dark"
            >
              View work
            </Link>
          </div>
        </header>
      </Section>

      <Section
        id="offerings"
        density="compact"
        variant="muted"
        eyebrow="Offerings"
        title="What we create together"
        description="Each session is shaped around the people, place, and pace that feel right — not a fixed package."
      >
        <ul className="grid gap-8 sm:grid-cols-2">
          {sessionsPage.offerings.map((offering) => (
            <li key={offering.title} className="border-t border-parchment pt-6">
              <h3 className="font-serif text-xl text-bark">{offering.title}</h3>
              <p className="type-page-body mt-3 text-stone leading-relaxed">
                {offering.description}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        density="compact"
        eyebrow="The process"
        title="How a session unfolds"
        description="A clear path from first note to finished gallery — unhurried at every step."
      >
        <ol className="grid gap-10 md:grid-cols-2">
          {sessionsPage.process.map((step) => (
            <li key={step.step} className="flex gap-4">
              <span
                className="type-eyebrow mt-1 shrink-0 tabular-nums tracking-wide text-site-green"
                aria-hidden
              >
                {step.step}
              </span>
              <div>
                <h3 className="font-serif text-xl text-bark">{step.title}</h3>
                <p className="type-page-body mt-2 text-stone leading-relaxed">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section density="compact" variant="muted">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="type-eyebrow tracking-wide">Investment</p>
            <h2 className="type-section-title mt-2 leading-tight">
              {sessionsPage.investment.title}
            </h2>
            <p className="type-page-body mt-4 text-stone leading-relaxed">
              {sessionsPage.investment.intro}
            </p>
            <ul className="mt-8 space-y-6">
              {sessionsPage.investment.tiers.map((tier) => (
                <li key={tier.label} className="border-t border-parchment pt-5">
                  <p className="text-sm font-medium tracking-wide text-bark">
                    {tier.label}
                  </p>
                  <p className="mt-1 font-serif text-2xl text-bark">
                    {tier.range}
                  </p>
                  <p className="type-page-body mt-2 text-stone leading-relaxed">
                    {tier.note}
                  </p>
                </li>
              ))}
            </ul>
            <p className="type-page-body mt-8 text-sm text-stone leading-relaxed">
              {sessionsPage.investment.footnote}
            </p>
          </div>

          <div>
            <p className="type-eyebrow tracking-wide">Included</p>
            <h2 className="type-section-title mt-2 leading-tight">
              What to expect
            </h2>
            <ul className="mt-6 space-y-3">
              {sessionsPage.inclusions.map((item) => (
                <li
                  key={item}
                  className="type-page-body border-t border-parchment pt-3 text-stone leading-relaxed first:border-t-0 first:pt-0"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section density="compact">
        <blockquote className="max-w-2xl border-l border-site-green pl-6 md:pl-8">
          <p className="font-serif text-xl leading-relaxed text-bark md:text-2xl">
            &ldquo;{sessionsPage.testimonial.quote}&rdquo;
          </p>
          <footer className="type-page-body mt-4 text-stone">
            — {sessionsPage.testimonial.attribution}
          </footer>
        </blockquote>
      </Section>

      <section className="border-t border-parchment bg-site-page py-14 md:py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <div className="max-w-md">
            <p className="type-eyebrow tracking-wide">
              {sessionsPage.closing.eyebrow}
            </p>
            <p className="type-page-body mt-2 text-stone leading-relaxed">
              {sessionsPage.closing.body}
            </p>
          </div>
          <Link
            href={inquiryCtas.primary.href}
            className="btn shrink-0 border-salmon-dark bg-salmon-dark text-white hover:bg-salmon"
          >
            {inquiryCtas.primary.label}
          </Link>
        </div>
      </section>
    </>
  );
}
