import type { Metadata } from "next";
import { Suspense } from "react";
import { Section } from "@/components/Section";
import { InquiryForm } from "@/components/inquiry/InquiryForm";
import { inquiryCopy } from "@/lib/inquiry/copy";
import { site } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: inquiryCopy.pageTitle,
  description: inquiryCopy.metaDescription,
  path: "/inquire",
});

export default function InquirePage() {
  return (
    <Section density="compact" className="pt-20 md:pt-28">
      <header className="mb-8 max-w-md md:mb-10">
        <p className="type-eyebrow tracking-wide">Select commissions</p>
        <h1 className="type-page-title mt-2 leading-tight md:text-4xl">
          {inquiryCopy.pageTitle}
        </h1>
        <p className="type-page-body mt-4 text-stone leading-relaxed">
          Limited availability · {site.locationRegion}
        </p>
      </header>

      <Suspense
        fallback={<div className="card h-[32rem] bg-parchment" aria-hidden />}
      >
        <InquiryForm />
      </Suspense>
    </Section>
  );
}
